import marimo

__generated_with = "0.20.1"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import akshare as ak

    symbol = mo.ui.text(value="000001", label="股票代码")

    mo.hstack([symbol])

    df = ak.stock_financial_analysis_indicator(
        symbol=symbol.value,
        start_year="2020",
    )

    mo.ui.table(df)
    return (df,)


if __name__ == "__main__":
    app.run()
