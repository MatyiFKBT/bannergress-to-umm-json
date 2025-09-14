# Bannergress to UMM JSON Converter

This project contains a userscript that allows downloading banner data from [Bannergress](https://bannergress.com/) in a format compatible with the Unofficial Mission Maker (UMM).

## How it works

1.  The userscript detects when you are on a Bannergress banner page (e.g., `https://bannergress.com/banner/...`).
2.  It injects a "Download UMM" button onto the page.
3.  When you click the button, it fetches the banner data from the public Bannergress API.
4.  It then converts the JSON data from the Bannergress format to the UMM format.
5.  Finally, it triggers a download of the converted `.json` file, which you can then use with UMM.
