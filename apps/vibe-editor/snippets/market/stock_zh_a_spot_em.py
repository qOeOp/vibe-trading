import marimo

__generated_with = "0.20.1"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import akshare as ak

    df = ak.stock_zh_a_spot_em()

    mo.ui.table(df)
    return (df,)


if __name__ == "__main__":
    app.run()
