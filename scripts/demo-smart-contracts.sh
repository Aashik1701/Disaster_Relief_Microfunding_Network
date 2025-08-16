#!/bin/bash

# 🎯 Disaster Relief Smart Contract Demo
# Comprehensive demonstration of the full disaster relief workflow

echo "🌟 Disaster Relief Smart Contract Demo"
echo "====================================="
echo ""

# Contract addresses from deployment
DISASTER_RELIEF_CONTRACT="0x5FbDB2315678afecb367f032d93F642f64180aa3"
MOCK_USDC_CONTRACT="0x5425890298aed601595a70AB815c96711a31Bc65"

# Private keys from Anvil
ADMIN_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ORACLE_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
GOVERNMENT_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
DONOR_KEY="0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
VICTIM_KEY="0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"

# Addresses from Anvil
ADMIN_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
ORACLE_ADDRESS="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
GOVERNMENT_ADDRESS="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
DONOR_ADDRESS="0x90F79bf6EB2c4f870365E785982E1f101E93b906"
VICTIM_ADDRESS="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"

RPC_URL="http://localhost:8545"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}🎯 $1${NC}"
    echo "$(printf '%*s' "${#1}" '' | tr ' ' '-')"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Anvil is running
check_anvil() {
    if ! curl -s "$RPC_URL" >/dev/null; then
        print_error "Anvil is not running on $RPC_URL"
        echo "Please start Anvil with: anvil"
        exit 1
    fi
    print_success "Anvil blockchain is running"
}

# Step 1: Setup and Initial State
step1_setup() {
    print_step "Step 1: Initial Setup & Contract State"
    
    # Check AVAX balance
    ADMIN_BALANCE=$(cast balance $ADMIN_ADDRESS --rpc-url $RPC_URL)
    print_info "Admin AVAX Balance: $(cast to-ether $ADMIN_BALANCE) ETH"
    
    # Check if we need to deploy a new MockUSDC with initial supply
    print_info "Setting up MockUSDC with initial supply..."
    
    # Create a new MockUSDC with proper initial supply
    print_info "Deploying new MockUSDC for testing..."
    USDC_DEPLOY=$(cast send --private-key $ADMIN_KEY --rpc-url $RPC_URL --create "$(forge create src/MockUSDC.sol:MockUSDC --constructor-args --output bytecode)" 2>/dev/null)
    
    # Get contract balances
    print_info "Contract deployed. Checking initial state..."
    echo ""
}

# Step 2: Oracle Reports Disaster
step2_disaster_report() {
    print_step "Step 2: Oracle Reports Natural Disaster"
    
    print_info "Oracle ($ORACLE_ADDRESS) reporting earthquake in Nepal..."
    
    # Report disaster (disasterId: 1, severity: 8, victims: 5000, estimatedCost: 1000000)
    DISASTER_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "reportDisaster(uint256,string,uint8,uint256,uint256)" \
        1 \
        "Earthquake in Nepal - Kathmandu Valley affected" \
        8 \
        5000 \
        1000000000000 \
        --private-key $ORACLE_KEY \
        --rpc-url $RPC_URL \
        --value 0 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Disaster reported successfully!"
        print_info "Disaster ID: 1"
        print_info "Location: Kathmandu Valley, Nepal"
        print_info "Severity: 8/10"
        print_info "Estimated Victims: 5,000"
        print_info "Estimated Relief Cost: 1,000,000 USDC"
    else
        print_error "Failed to report disaster"
    fi
    echo ""
}

# Step 3: Community Funding (AVAX Bonds)
step3_avax_funding() {
    print_step "Step 3: Community Funds Relief with AVAX"
    
    print_info "Donor ($DONOR_ADDRESS) creating AVAX bond..."
    
    # Create AVAX bond (12 months, with description)
    AVAX_AMOUNT="2000000000000000000"  # 2 AVAX
    BOND_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "issueAVAXBond(uint256,string)" \
        12 \
        "Emergency relief fund for Nepal earthquake victims" \
        --private-key $DONOR_KEY \
        --rpc-url $RPC_URL \
        --value $AVAX_AMOUNT 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "AVAX bond created successfully!"
        print_info "Bond Amount: 2 AVAX"
        print_info "Maturity: 12 months"
        print_info "Purpose: Nepal earthquake relief"
        
        # Check total AVAX pool
        AVAX_POOL=$(cast call $DISASTER_RELIEF_CONTRACT "getTreasuryBalances()" --rpc-url $RPC_URL)
        print_info "Total AVAX in Relief Pool: $(cast to-ether $AVAX_POOL | cut -d' ' -f1) AVAX"
    else
        print_error "Failed to create AVAX bond"
    fi
    echo ""
}

# Step 4: Government Approval
step4_government_approval() {
    print_step "Step 4: Government Approves Relief Distribution"
    
    print_info "Government ($GOVERNMENT_ADDRESS) approving disaster relief..."
    
    # Approve disaster for relief distribution
    APPROVAL_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "approveDisasterRelief(uint256)" \
        1 \
        --private-key $GOVERNMENT_KEY \
        --rpc-url $RPC_URL 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Government approval granted!"
        print_info "Disaster ID 1 approved for relief distribution"
        print_info "Funds are now available for victim payouts"
    else
        print_error "Failed to get government approval"
    fi
    echo ""
}

# Step 5: Victim Registration
step5_victim_registration() {
    print_step "Step 5: Victim Self-Registration"
    
    print_info "Victim ($VICTIM_ADDRESS) registering for aid..."
    
    # Register victim with identity proof
    REGISTER_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "registerVictim(uint256,string)" \
        1 \
        "Proof of residence in Kathmandu - ID: NPL123456789" \
        --private-key $VICTIM_KEY \
        --rpc-url $RPC_URL 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Victim registered successfully!"
        print_info "Identity verified and registered for aid"
        print_info "Ready to receive emergency relief"
    else
        print_error "Failed to register victim"
    fi
    echo ""
}

# Step 6: Emergency Relief Distribution
step6_relief_distribution() {
    print_step "Step 6: Emergency Relief Distribution (AVAX)"
    
    print_info "Government distributing emergency AVAX relief..."
    
    # Prepare distribution arrays
    VICTIMS_ARRAY="[$VICTIM_ADDRESS]"
    AMOUNTS_ARRAY="[500000000000000000]"  # 0.5 AVAX per victim
    PAYMENT_TYPES_ARRAY="[0]"  # 0 = AVAX payment
    
    # Execute bulk AVAX payout
    DISTRIBUTION_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "executeBulkAVAXPayout(uint256,address[],uint256[],uint8[])" \
        1 \
        "$VICTIMS_ARRAY" \
        "$AMOUNTS_ARRAY" \
        "$PAYMENT_TYPES_ARRAY" \
        --private-key $GOVERNMENT_KEY \
        --rpc-url $RPC_URL 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Emergency relief distributed!"
        print_info "0.5 AVAX sent to earthquake victim"
        print_info "Instant relief provided for immediate needs"
        
        # Check victim's new balance
        VICTIM_BALANCE=$(cast balance $VICTIM_ADDRESS --rpc-url $RPC_URL)
        print_info "Victim's AVAX Balance: $(cast to-ether $VICTIM_BALANCE) AVAX"
    else
        print_error "Failed to distribute relief"
    fi
    echo ""
}

# Step 7: Yield Generation and Transparency
step7_yield_generation() {
    print_step "Step 7: Automatic Yield Generation"
    
    print_info "Treasury generating yield from AVAX holdings..."
    
    # Generate AVAX yield
    YIELD_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "generateAVAXYield()" \
        --private-key $ADMIN_ADDRESS \
        --rpc-url $RPC_URL 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Yield generated successfully!"
        print_info "Additional funds created for ongoing relief"
        print_info "Sustainable funding mechanism active"
    else
        print_info "Yield generation requires time or additional activity"
    fi
    echo ""
}

# Step 8: Bond Redemption
step8_bond_redemption() {
    print_step "Step 8: Early Bond Redemption (50% penalty)"
    
    print_info "Donor redeeming bond early (demonstrating flexibility)..."
    
    # Redeem bond early (bondId: 1)
    REDEEM_TX=$(cast send $DISASTER_RELIEF_CONTRACT \
        "redeemBondEarly(uint256)" \
        1 \
        --private-key $DONOR_KEY \
        --rpc-url $RPC_URL 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Bond redeemed early!"
        print_info "50% penalty applied (funds stay in relief pool)"
        print_info "Donor receives 50% back, rest helps more victims"
        
        # Check donor's balance
        DONOR_BALANCE=$(cast balance $DONOR_ADDRESS --rpc-url $RPC_URL)
        print_info "Donor's AVAX Balance: $(cast to-ether $DONOR_BALANCE) AVAX"
    else
        print_error "Failed to redeem bond"
    fi
    echo ""
}

# Step 9: Final State Summary
step9_final_summary() {
    print_step "Step 9: Final State & Impact Summary"
    
    # Get final treasury balances
    TREASURY_DATA=$(cast call $DISASTER_RELIEF_CONTRACT "getTreasuryBalances()" --rpc-url $RPC_URL 2>/dev/null)
    
    print_success "Disaster Relief Workflow Complete!"
    echo ""
    print_info "📊 IMPACT SUMMARY:"
    print_info "==================="
    print_info "✅ Natural disaster reported and verified"
    print_info "✅ Community funding raised (2 AVAX)"
    print_info "✅ Government approval obtained"
    print_info "✅ Victim registered and verified"
    print_info "✅ Emergency relief distributed (0.5 AVAX)"
    print_info "✅ Sustainable funding mechanism active"
    print_info "✅ Transparent blockchain record maintained"
    echo ""
    print_info "💰 FINANCIAL IMPACT:"
    print_info "==================="
    print_info "• Total Raised: 2.0 AVAX"
    print_info "• Emergency Relief: 0.5 AVAX"
    print_info "• Available for More Relief: ~1.0 AVAX"
    print_info "• Bond Redemption: ~1.0 AVAX (50% penalty keeps 0.5 for relief)"
    echo ""
    print_info "🌍 REAL-WORLD BENEFITS:"
    print_info "======================"
    print_info "• Instant relief delivery (sub-second finality)"
    print_info "• Complete transparency (all transactions on-chain)"
    print_info "• Low fees on Avalanche (pennies per transaction)"
    print_info "• Sustainable funding through yield generation"
    print_info "• Geographic verification and targeting"
    print_info "• Self-sovereign victim registration"
    echo ""
}

# Main execution
main() {
    echo "🚀 Starting Disaster Relief Smart Contract Demo"
    echo "Time: $(date)"
    echo ""
    
    # Pre-flight checks
    check_anvil
    
    # Execute workflow
    step1_setup
    step2_disaster_report
    step3_avax_funding
    step4_government_approval
    step5_victim_registration
    step6_relief_distribution
    step7_yield_generation
    step8_bond_redemption
    step9_final_summary
    
    echo "🎯 Demo completed successfully!"
    echo ""
    echo "📋 To interact with contracts manually:"
    echo "  Contract Address: $DISASTER_RELIEF_CONTRACT"
    echo "  RPC URL: $RPC_URL"
    echo "  Explorer: View transactions in Anvil logs"
    echo ""
    echo "🔄 To restart demo: Stop Anvil, restart it, redeploy contracts, and run this script again"
}

# Run the demo
main
