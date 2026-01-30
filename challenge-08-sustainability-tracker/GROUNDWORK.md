_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

This challenge is about using AI to **measure, optimize, and communicate sustainability efforts**. It involves data tracking, impact modeling, and customer engagement.

### 1. Data Requirements

- **Waste Data**: Records of waste generated, categorized by type (e.g., plastic cups, food waste, general waste). This might need to be manually logged initially.
- **Utility Bills**: Data on electricity and water consumption.
- **Supplier Information**: Details about the suppliers of cups, straws, ingredients, etc., including their own sustainability credentials if available.
- **Customer Behavior Data**: Data on how many customers bring their own reusable cups (e.g., from a loyalty program).
- **Life Cycle Assessment (LCA) Data**: Publicly available data on the environmental impact of different materials (e.g., the carbon footprint of a plastic cup vs. a paper cup vs. a reusable cup).

### 2. Key AI/ML Concepts

- **Impact Modeling**: Creating a model that estimates the total environmental footprint (e.g., in kg of CO2 equivalent) based on sales data and operational practices.
- **Optimization**: Finding the optimal operational changes to reduce the environmental impact while considering cost and customer experience. For example, what is the best "reusable cup discount" to offer to maximize adoption without hurting revenue?
- **Recommender Systems**: Recommending sustainable choices to the business owner (e.g., "Switching to this paper cup supplier could reduce your carbon footprint by 15%") or to the customer (e.g., "Choosing oat milk instead of dairy milk for this drink is a more sustainable option").

## Suggested Approaches

### Approach A: Sustainability Dashboard

- **Description**: A dashboard for the business owner that tracks key sustainability metrics in near real-time.
- **Implementation**:
    - Create a simple web interface for staff to log daily waste (e.g., "3 kg of food waste", "5 kg of plastic waste").
    - Build a model that takes daily sales data and waste logs to calculate metrics like "waste per order" or "carbon footprint per drink".
    - Visualize these metrics over time using charts and graphs.
    - The dashboard could also show positive metrics, like "number of reusable cups used today".
- **Pros**: Provides visibility and helps the business to set and track sustainability goals.
- **Cons**: Relies on manual data entry, which can be inconsistent.

### Approach B: Eco-Friendly Operations Advisor

- **Description**: An AI-powered advisor that suggests specific, actionable changes Tea Dojo can make to improve sustainability.
- **Implementation**:
    - Build a knowledge base of sustainable practices for F&B businesses (e.g., from industry reports, government guidelines).
    - Create a model that analyzes Tea Dojo's current operations (based on sales, waste, and supplier data) and compares them against the best practices.
    - The system would then generate a prioritized list of recommendations, such as "Switch to a certified compostable straw supplier" or "Install a low-flow faucet to reduce water usage".
- **Pros**: Provides concrete, actionable advice.
- **Cons**: The quality of the recommendations depends on the comprehensiveness of the knowledge base.

### Approach C: Customer-Facing Sustainability Engagement Tool

- **Description**: A tool that engages customers in Tea Dojo's sustainability journey.
- **Implementation**:
    - Create a feature in a mobile app or on the website that shows the environmental impact of each drink on the menu.
    - Gamify sustainability by creating a loyalty program that rewards customers for making eco-friendly choices (e.g., bringing a reusable cup, choosing plant-based milk).
    - The tool could show the collective impact of all customers' sustainable choices (e.g., "Together, we have saved 10,000 plastic cups this month!").
- **Pros**: Builds brand loyalty, educates customers, and can create a powerful marketing story.
- **Cons**: Requires a customer-facing app or website, and the impact calculations need to be transparent and credible.

## Resources

- **Life Cycle Assessment (LCA) Databases**:
    - [Ecoinvent](https://www.ecoinvent.org/)
    - [OpenLCA Nexus](https://nexus.openlca.org/)
- **Sustainability Guidelines**:
    - [Singapore's Zero Waste Masterplan](https://www.towardszerowaste.gov.sg/zero-waste-masterplan/)
- **Customer Engagement**:
    - [Gamification in Sustainability](https://www.emerald.com/insight/content/doi/10.1108/S2051-503020200000025010/full/html)

## Sample Data

See the `data` directory for sample CSV files of daily waste logs and a list of sustainable suppliers's daily's daily waste logs and utility consumption.
