module fundflow::crowdfunding {
    use std::signer;
    use std::vector;
    use std::error;
    use std::option::{Self, Option};
    
    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_PROJECT_OWNER: u64 = 3;
    const E_PROJECT_NOT_FOUND: u64 = 4;
    const E_FUNDING_PERIOD_ENDED: u64 = 5;
    const E_FUNDING_PERIOD_NOT_ENDED: u64 = 6;
    const E_FUNDING_GOAL_NOT_MET: u64 = 7;
    const E_ALREADY_CLAIMED: u64 = 8;
    const E_ALREADY_REFUNDED: u64 = 9;
    const E_MILESTONE_NOT_APPROVED: u64 = 10;
    const E_INVALID_MILESTONE_INDEX: u64 = 11;
    const E_ALREADY_VOTED: u64 = 12;
    
    /// Milestone status
    const MILESTONE_PENDING: u8 = 0;
    const MILESTONE_APPROVED: u8 = 1;
    const MILESTONE_REJECTED: u8 = 2;
    
    /// Project status
    const PROJECT_FUNDING: u8 = 0;
    const PROJECT_FUNDED: u8 = 1;
    const PROJECT_FAILED: u8 = 2;
    const PROJECT_COMPLETED: u8 = 3;
    
    /// Milestone structure
    struct Milestone has store, drop, copy {
        description: vector<u8>,
        amount: u64,
        status: u8,
        votes_for: u64,
        votes_against: u64,
    }
    
    /// Project structure
    struct Project has store, drop, copy {
        id: u64,
        owner: address,
        title: vector<u8>,
        description: vector<u8>,
        funding_goal: u64,
        deadline: u64,
        current_amount: u64,
        status: u8,
        milestones: vector<Milestone>,
        current_milestone: u64,
    }
    
    /// Contribution record
    struct Contribution has store, drop, copy {
        contributor: address,
        amount: u64,
        refunded: bool,
        voted_on_milestones: vector<u64>,
    }
    
    /// Platform state
    struct FundFlowState has key {
        projects: vector<Project>,
        project_contributions: vector<vector<Contribution>>,
        next_project_id: u64,
    }
    
    /// Initialize the FundFlow platform
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<FundFlowState>(account_addr), error::already_exists(E_ALREADY_INITIALIZED));
        
        move_to(account, FundFlowState {
            projects: vector::empty<Project>(),
            project_contributions: vector::empty<vector<Contribution>>(),
            next_project_id: 0,
        });
    }
    
    /// Create a new project
    public entry fun create_project(
        account: &signer,
        title: vector<u8>,
        description: vector<u8>,
        funding_goal: u64,
        deadline: u64,
        milestone_descriptions: vector<vector<u8>>,
        milestone_amounts: vector<u64>
    ) acquires FundFlowState {
        let account_addr = signer::address_of(account);
        assert!(exists<FundFlowState>(account_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global_mut<FundFlowState>(account_addr);
        let project_id = state.next_project_id;
        
        // Create milestones
        let milestones = vector::empty<Milestone>();
        let i = 0;
        let len = vector::length(&milestone_descriptions);
        
        while (i < len) {
            let description = *vector::borrow(&milestone_descriptions, i);
            let amount = *vector::borrow(&milestone_amounts, i);
            
            vector::push_back(&mut milestones, Milestone {
                description,
                amount,
                status: MILESTONE_PENDING,
                votes_for: 0,
                votes_against: 0,
            });
            
            i = i + 1;
        };
        
        // Create project
        let project = Project {
            id: project_id,
            owner: account_addr,
            title,
            description,
            funding_goal,
            deadline,
            current_amount: 0,
            status: PROJECT_FUNDING,
            milestones,
            current_milestone: 0,
        };
        
        vector::push_back(&mut state.projects, project);
        vector::push_back(&mut state.project_contributions, vector::empty<Contribution>());
        state.next_project_id = project_id + 1;
    }
    
    /// Fund a project
    public entry fun fund_project(
        account: &signer,
        project_id: u64,
        amount: u64
    ) acquires FundFlowState {
        let account_addr = signer::address_of(account);
        assert!(exists<FundFlowState>(account_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global_mut<FundFlowState>(account_addr);
        assert!(project_id < vector::length(&state.projects), error::invalid_argument(E_PROJECT_NOT_FOUND));
        
        let project = vector::borrow_mut(&mut state.projects, project_id);
        assert!(project.status == PROJECT_FUNDING, error::invalid_state(E_FUNDING_PERIOD_ENDED));
        
        // TODO: In a real implementation, we would transfer tokens here
        // For now, we just update the project's current amount
        project.current_amount = project.current_amount + amount;
        
        // Record the contribution
        let contributions = vector::borrow_mut(&mut state.project_contributions, project_id);
        vector::push_back(contributions, Contribution {
            contributor: account_addr,
            amount,
            refunded: false,
            voted_on_milestones: vector::empty<u64>(),
        });
        
        // Check if funding goal is met
        if (project.current_amount >= project.funding_goal) {
            project.status = PROJECT_FUNDED;
        }
    }
    
    /// Vote on a milestone
    public entry fun vote_on_milestone(
        account: &signer,
        project_id: u64,
        milestone_index: u64,
        approve: bool
    ) acquires FundFlowState {
        let account_addr = signer::address_of(account);
        assert!(exists<FundFlowState>(account_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global_mut<FundFlowState>(account_addr);
        assert!(project_id < vector::length(&state.projects), error::invalid_argument(E_PROJECT_NOT_FOUND));
        
        let project = vector::borrow_mut(&mut state.projects, project_id);
        assert!(project.status == PROJECT_FUNDED, error::invalid_state(E_FUNDING_GOAL_NOT_MET));
        assert!(milestone_index < vector::length(&project.milestones), error::invalid_argument(E_INVALID_MILESTONE_INDEX));
        assert!(milestone_index == project.current_milestone, error::invalid_argument(E_INVALID_MILESTONE_INDEX));
        
        // Check if the user has contributed to this project
        let contributions = vector::borrow_mut(&mut state.project_contributions, project_id);
        let contribution_index = find_contribution_index(contributions, account_addr);
        assert!(contribution_index != 0xFFFFFFFF, error::permission_denied(E_NOT_PROJECT_OWNER));
        
        let contribution = vector::borrow_mut(contributions, contribution_index);
        
        // Check if the user has already voted on this milestone
        assert!(!has_voted_on_milestone(&contribution.voted_on_milestones, milestone_index), error::invalid_state(E_ALREADY_VOTED));
        
        // Record the vote
        vector::push_back(&mut contribution.voted_on_milestones, milestone_index);
        
        // Update the milestone votes
        let milestone = vector::borrow_mut(&mut project.milestones, milestone_index);
        if (approve) {
            milestone.votes_for = milestone.votes_for + contribution.amount;
        } else {
            milestone.votes_against = milestone.votes_against + contribution.amount;
        }
        
        // Check if the milestone has been approved (more than 50% of funds voted for)
        if (milestone.votes_for > project.current_amount / 2) {
            milestone.status = MILESTONE_APPROVED;
        } else if (milestone.votes_against > project.current_amount / 2) {
            milestone.status = MILESTONE_REJECTED;
        }
    }
    
    /// Release funds for a milestone
    public entry fun release_funds(
        account: &signer,
        project_id: u64
    ) acquires FundFlowState {
        let account_addr = signer::address_of(account);
        assert!(exists<FundFlowState>(account_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global_mut<FundFlowState>(account_addr);
        assert!(project_id < vector::length(&state.projects), error::invalid_argument(E_PROJECT_NOT_FOUND));
        
        let project = vector::borrow_mut(&mut state.projects, project_id);
        assert!(account_addr == project.owner, error::permission_denied(E_NOT_PROJECT_OWNER));
        assert!(project.status == PROJECT_FUNDED, error::invalid_state(E_FUNDING_GOAL_NOT_MET));
        assert!(project.current_milestone < vector::length(&project.milestones), error::invalid_state(E_INVALID_MILESTONE_INDEX));
        
        let milestone = vector::borrow(&project.milestones, project.current_milestone);
        assert!(milestone.status == MILESTONE_APPROVED, error::invalid_state(E_MILESTONE_NOT_APPROVED));
        
        // TODO: In a real implementation, we would transfer tokens to the project owner here
        
        // Move to the next milestone
        project.current_milestone = project.current_milestone + 1;
        
        // Check if all milestones are completed
        if (project.current_milestone >= vector::length(&project.milestones)) {
            project.status = PROJECT_COMPLETED;
        }
    }
    
    /// Refund backers if the project fails to meet its funding goal
    public entry fun refund_backers(
        account: &signer,
        project_id: u64
    ) acquires FundFlowState {
        let account_addr = signer::address_of(account);
        assert!(exists<FundFlowState>(account_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global_mut<FundFlowState>(account_addr);
        assert!(project_id < vector::length(&state.projects), error::invalid_argument(E_PROJECT_NOT_FOUND));
        
        let project = vector::borrow_mut(&mut state.projects, project_id);
        
        // Check if the funding period has ended and the goal was not met
        assert!(project.status == PROJECT_FUNDING, error::invalid_state(E_FUNDING_PERIOD_ENDED));
        
        // TODO: In a real implementation, we would check the current time against the deadline
        // For now, we'll just allow the refund to be triggered manually
        
        // Mark the project as failed
        project.status = PROJECT_FAILED;
        
        // TODO: In a real implementation, we would transfer tokens back to the backers here
        
        // Mark all contributions as refunded
        let contributions = vector::borrow_mut(&mut state.project_contributions, project_id);
        let i = 0;
        let len = vector::length(contributions);
        
        while (i < len) {
            let contribution = vector::borrow_mut(contributions, i);
            contribution.refunded = true;
            i = i + 1;
        }
    }
    
    /// Helper function to find a contribution by address
    fun find_contribution_index(contributions: &vector<Contribution>, addr: address): u64 {
        let i = 0;
        let len = vector::length(contributions);
        
        while (i < len) {
            let contribution = vector::borrow(contributions, i);
            if (contribution.contributor == addr) {
                return i
            };
            i = i + 1;
        };
        
        return 0xFFFFFFFF // Not found
    }
    
    /// Helper function to check if a user has voted on a milestone
    fun has_voted_on_milestone(voted_milestones: &vector<u64>, milestone_index: u64): bool {
        let i = 0;
        let len = vector::length(voted_milestones);
        
        while (i < len) {
            if (*vector::borrow(voted_milestones, i) == milestone_index) {
                return true
            };
            i = i + 1;
        };
        
        return false
    }
    
    /// Get project details
    public fun get_project(state_addr: address, project_id: u64): Option<Project> acquires FundFlowState {
        assert!(exists<FundFlowState>(state_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global<FundFlowState>(state_addr);
        if (project_id >= vector::length(&state.projects)) {
            return option::none<Project>()
        };
        
        let project = vector::borrow(&state.projects, project_id);
        option::some(*project)
    }
    
    /// Get the number of projects
    public fun get_project_count(state_addr: address): u64 acquires FundFlowState {
        assert!(exists<FundFlowState>(state_addr), error::not_found(E_NOT_INITIALIZED));
        
        let state = borrow_global<FundFlowState>(state_addr);
        vector::length(&state.projects)
    }
} 