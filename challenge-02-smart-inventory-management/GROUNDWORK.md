_This is a preliminary document to provide technical context and guidance for the hackathon. It is not exhaustive and should be supplemented with your own research and creativity._

## Technical Groundwork

The core of this challenge is to build a **demand forecasting model** to predict ingredient consumption and optimize inventory.

### 1. Data Requirements

- **Sales Data**: Anonymized transaction history is the most critical dataset. Each record should include the items purchased, all customizations (which affect ingredient usage), and a timestamp.
- **Ingredient & Recipe Data**: A detailed breakdown of every menu item into its base ingredients. For example, a "Large Classic Milk Tea with Pearls" would map to specific quantities of tea, milk, sugar, and tapioca pearls.
- **Inventory Data**: Current stock levels and historical inventory records, including delivery dates, quantities, and expiration dates.
- **External Data**: Contextual data that can influence sales, such as:
    - **Weather forecasts**: Temperature, precipitation, etc.
    - **Local events**: Public holidays, school holidays, festivals in the Ang Mo Kio area.
    - **Promotions**: Data on past and future marketing campaigns.

### 2. Key AI/ML Concepts

- **Time Series Forecasting**: This is the primary technique for this challenge. Sales data is a time series, and models can be trained to predict future values based on past patterns.
- **Regression Models**: These models can be used to predict the quantity of ingredients needed based on various input features (e.g., day of the week, weather, promotions).
- **Feature Engineering**: Creating meaningful input features from raw data is crucial. For example, you could create features like `is_weekend`, `is_holiday`, or `day_of_week` from the timestamp.

## Suggested Approaches

### Approach A: Classical Time Series Forecasting

- **Description**: Use statistical models to forecast sales for each item on the menu.
- **Implementation**:
    - Use models like **ARIMA** (AutoRegressive Integrated Moving Average) or **Exponential Smoothing**.
    - Libraries like `statsmodels` in Python provide robust implementations of these models.
    - Forecast sales for each item, then use the recipe data to convert these forecasts into ingredient demand.
- **Pros**: Well-understood, relatively simple to implement, and effective for data with clear trends and seasonality.
- **Cons**: May not effectively incorporate external factors (like weather or events).

### Approach B: Machine Learning for Forecasting

- **Description**: Use machine learning models to predict ingredient demand directly, incorporating a wide range of features.
- **Implementation**:
    - Use models like **Gradient Boosting** (e.g., XGBoost, LightGBM) or **Random Forests**.
    - Create a rich feature set including time-based features, weather data, and event flags.
    - The model's target would be the quantity of a specific ingredient used per day.
- **Pros**: Can handle complex relationships and incorporate many types of data, often leading to higher accuracy.
- **Cons**: Requires more data for training and careful feature engineering.

### Approach C: Deep Learning (Advanced)

- **Description**: Use neural networks, specifically **Long Short-Term Memory (LSTM)** or **Gated Recurrent Unit (GRU)** networks, which are designed for sequence data.
- **Implementation**:
    - Use frameworks like TensorFlow or PyTorch.
    - This approach is well-suited for capturing complex, non-linear patterns in sales data over long periods.
- **Pros**: Can achieve state-of-the-art performance, especially with large datasets.
- **Cons**: Requires significant data, computational resources, and expertise to train effectively.

## Resources

- **Forecasting Libraries**:
    - [Prophet (by Facebook)](https://facebook.github.io/prophet/)
    - [Statsmodels (for ARIMA, etc.)](https://www.statsmodels.org/stable/index.html)
    - [XGBoost](https://xgboost.ai/)
- **Tutorials**:
    - [A Guide to Time Series Forecasting with ARIMA in Python 3](https://www.digitalocean.com/community/tutorials/a-guide-to-time-series-forecasting-with-arima-in-python-3)
    - [Time Series Forecasting with Prophet](https://www.kaggle.com/code/prashant111/tutorial-time-series-forecasting-with-prophet)

## Sample Data

See the `data` directory for sample CSV files for ingredient lists, recipes, and sales transactions.
