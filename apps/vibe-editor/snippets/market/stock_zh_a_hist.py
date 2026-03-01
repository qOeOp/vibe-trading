import marimo

__generated_with = "0.20.1"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import akshare as ak

    symbol = mo.ui.text(value="000001", label="股票代码")
    period = mo.ui.dropdown(
        options=["daily", "weekly", "monthly"],
        value="daily",
        label="频率",
    )
    start_date = mo.ui.text(value="20240101", label="起始日期")
    end_date = mo.ui.text(value="20241231", label="截止日期")

    mo.hstack([symbol, period, start_date, end_date])

    df = ak.stock_zh_a_hist(
        symbol=symbol.value,
        period=period.value,
        start_date=start_date.value,
        end_date=end_date.value,
        adjust="qfq",
    )

    mo.ui.table(df)
    return (df,)


if __name__ == "__main__":
    app.run()
