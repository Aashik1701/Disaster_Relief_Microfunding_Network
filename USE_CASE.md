# Use Case: End-to-End Disaster Relief Operation

This use case describes the complete lifecycle of a disaster relief operation on the Avalanche Disaster Relief Microfunding Network. It illustrates the interactions between different user roles and the platform's core functionalities.

## 1. Actors

*   **Government Official:** An authorized representative from a government agency responsible for disaster management.
*   **Donor:** An individual or organization willing to contribute funds to the relief effort.
*   **Treasury Manager:** A designated official responsible for managing and allocating the collected funds.
*   **Victim / Beneficiary:** An individual affected by the disaster who needs to receive aid.
*   **Vendor:** A pre-verified local business that provides essential goods and services.
*   **System:** The Avalanche Disaster Relief Microfunding Network platform.

## 2. Pre-conditions

*   The Government Official, Treasury Manager, and Vendor have been onboarded and have active accounts on the platform.
*   The Vendor has completed the KYC (Know Your Customer) verification process and is approved to operate within a specific region.
*   Donors and Victims can create accounts as needed.

## 3. Main Success Scenario: The "Cyclone Helios" Relief Effort

### Step 1: Disaster Declaration (Government)

1.  A powerful cyclone named "Helios" makes landfall, causing significant damage in the coastal region of "Seaside Province."
2.  A **Government Official** logs into the platform.
3.  The official navigates to the "Disaster Management" section and creates a new disaster zone.
4.  They define the disaster details:
    *   **Name:** Cyclone Helios Relief
    *   **Location:** Seaside Province (defined by geographic coordinates, creating a geo-fence)
    *   **Severity:** High
    *   **Description:** Details about the cyclone's impact.
5.  The **System** creates the disaster zone on the blockchain, making it an official, immutable record. The geo-fencing is now active.

### Step 2: Fundraising Campaign (Donors)

1.  The newly created "Cyclone Helios Relief" campaign is now visible on the platform's public portal.
2.  A **Donor**, seeing the news, visits the platform.
3.  They navigate to the "Cyclone Helios Relief" campaign page.
4.  The donor decides to contribute $100. They connect their Web3 wallet and approve a transaction to send 100 USDC to the campaign's smart contract.
5.  The **System** records the donation on the blockchain. The total funds raised for the campaign are updated in real-time. The donor receives a transaction receipt for their records.

### Step 3: Fund Allocation (Treasury)

1.  The **Treasury Manager** sees that the campaign has raised a substantial amount of funds.
2.  They log in and navigate to the "Treasury Dashboard."
3.  The manager reviews the needs of the "Cyclone Helios" disaster zone and decides to allocate an initial $50,000 for immediate aid.
4.  They create an allocation plan, specifying that the funds are to be used for food, water, and temporary shelter.
5.  The **System** moves the allocated funds into a "disbursable" state within the smart contract, specifically for the "Cyclone Helios" zone.

### Step 4: Aid Distribution (Victims)

1.  A **Victim** of the cyclone, who has lost their home, needs to access aid.
2.  They register on the platform's victim portal using their mobile phone. They may need to provide some form of identification to be verified (this can be a simplified, emergency-level verification).
3.  Once verified, the **System** automatically issues them a digital voucher. For example, they might receive a voucher worth 50 USDC, designated for "Food and Water."
4.  The voucher is tied to the victim's digital identity on the platform and is only redeemable within the "Seaside Province" geo-fenced area.

### Step 5: Redeeming Aid (Vendors and Victims)

1.  The **Victim** goes to a local grocery store, which is a **Verified Vendor** on the platform.
2.  They select essential items like bottled water, canned food, and bread, totaling 45 USDC.
3.  At the checkout, the victim presents their digital voucher (e.g., a QR code on their phone).
4.  The **Vendor** uses their terminal (a tablet or phone with the vendor app) to scan the QR code.
5.  The **System** checks the validity of the voucher:
    *   Is the voucher authentic?
    *   Does it have sufficient balance?
    *   Is the vendor located within the "Seaside Province" disaster zone?
6.  All checks pass. The vendor enters the amount (45 USDC). The victim authorizes the transaction.
7.  The **System** instantly processes the payment. 45 USDC is transferred from the relief fund to the vendor's wallet. The victim's voucher balance is updated to 5 USDC.
8.  The transaction is recorded on the blockchain, including what was purchased. This serves as a "proof of aid."

## 4. Post-conditions

*   The victim has received the necessary supplies.
*   The vendor has been compensated for the goods.
*   The donation has been verifiably spent on aid within the designated disaster zone.
*   The entire transaction is transparent and auditable on the blockchain. Donors and government officials can see exactly how funds are being used.

## 5. Extensions (Alternative Scenarios)

*   **Fraud Attempt:** A vendor outside the "Seaside Province" tries to process a victim's voucher. The system's geo-fencing rejects the transaction.
*   **Insufficient Funds:** A donor tries to donate more USDC than they have in their wallet. The transaction fails.
*   **Campaign Goal Met:** The fundraising campaign reaches its target. The system can be configured to automatically stop accepting further donations.
*   **Disaster End:** The Government Official declares the relief effort is complete. The system can then close the disaster zone, and any remaining funds can be returned to the main treasury or re-allocated.
