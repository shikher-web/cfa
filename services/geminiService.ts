
import { GoogleGenAI } from "@google/genai";
import type { CompanyData, ValuationAssumptions, MultiModelValuationResult } from '../types';

// Per guidelines, API key must be from process.env.API_KEY
// and ai must be initialized with it.
// The exclamation mark is used to assert that process.env.API_KEY is not undefined.
// In a real-world app, you'd want more robust handling for a missing key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Extracts a JSON object from a string that might be wrapped in markdown.
 * Handles cases with or without the 'json' language identifier.
 * @param {string} text The text to parse.
 * @returns {string} The extracted JSON string.
 */
const extractJson = (text: string): string => {
    // Regex to find content between ```json and ``` or just ``` and ```
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        return match[1].trim();
    }
    // If no markdown block is found, assume the whole text is the JSON.
    return text.trim();
};


/**
 * Generates a string representation of the expected JSON structure for company data.
 * This is used within the prompt to guide the model's output.
 * @returns {string}
 */
const getCompanyDataJsonStructure = (): string => {
    return `{
      "companyName": "string",
      "ticker": "string",
      "currency": "string (e.g., USD or INR)",
      "summary": "A comprehensive summary of the company's business, market position, and recent performance.",
      "incomeStatement": {
        "[Latest Year/TTM]": { "Revenue": "number", "COGS": "number", "Gross Profit": "number", "Operating Expenses": "number", "Net Income": "number" },
        "[Previous Year]": { "Revenue": "number", "COGS": "number", "Gross Profit": "number", "Operating Expenses": "number", "Net Income": "number" },
        "[Year before Previous]": { "Revenue": "number", "COGS": "number", "Gross Profit": "number", "Operating Expenses": "number", "Net Income": "number" }
      },
      "balanceSheet": {
        "[Latest Year/TTM]": { "Total Assets": "number", "Total Liabilities": "number", "Total Equity": "number", "Cash and Equivalents": "number", "Long-term Debt": "number" },
        "[Previous Year]": { "Total Assets": "number", "Total Liabilities": "number", "Total Equity": "number", "Cash and Equivalents": "number", "Long-term Debt": "number" },
        "[Year before Previous]": { "Total Assets": "number", "Total Liabilities": "number", "Total Equity": "number", "Cash and Equivalents": "number", "Long-term Debt": "number" }
      },
      "cashFlowStatement": {
        "[Latest Year/TTM]": { "Operating Cash Flow": "number", "Investing Cash Flow": "number", "Financing Cash Flow": "number", "Net Change in Cash": "number" },
        "[Previous Year]": { "Operating Cash Flow": "number", "Investing Cash Flow": "number", "Financing Cash Flow": "number", "Net Change in Cash": "number" },
        "[Year before Previous]": { "Operating Cash Flow": "number", "Investing Cash Flow": "number", "Financing Cash Flow": "number", "Net Change in Cash": "number" }
      },
      "ratios": [
        { "name": "P/E Ratio", "value": "string", "commentary": "string", "benchmark": "string" },
        { "name": "Debt-to-Equity", "value": "string", "commentary": "string", "benchmark": "string" },
        { "name": "Return on Equity (ROE)", "value": "string", "commentary": "string", "benchmark": "string" },
        { "name": "Current Ratio", "value": "string", "commentary": "string", "benchmark": "string" }
      ],
      "ratioHistory": [
        { "name": "P/E Ratio", "history": [{ "year": "[Latest Year]", "value": "number" }, { "year": "[Year-1]", "value": "number" }, { "year": "[Year-2]", "value": "number" }, { "year": "[Year-3]", "value": "number" }, { "year": "[Year-4]", "value": "number" }] },
        { "name": "Debt-to-Equity", "history": [{ "year": "[Latest Year]", "value": "number" }, { "year": "[Year-1]", "value": "number" }, { "year": "[Year-2]", "value": "number" }, { "year": "[Year-3]", "value": "number" }, { "year": "[Year-4]", "value": "number" }] },
        { "name": "Return on Equity (ROE)", "history": [{ "year": "[Latest Year]", "value": "number" }, { "year": "[Year-1]", "value": "number" }, { "year": "[Year-2]", "value": "number" }, { "year": "[Year-3]", "value": "number" }, { "year": "[Year-4]", "value": "number" }] }
      ],
      "news": [
        { "headline": "string", "source": "string", "summary": "string" }
      ],
      "valuationAssumptions": {
        "revenueGrowthRate": "number",
        "ebitdaMargin": "number",
        "taxRate": "number",
        "capexAsPercentageOfRevenue": "number",
        "depreciationAsPercentageOfRevenue": "number",
        "changeInWorkingCapitalAsPercentageOfRevenue": "number",
        "terminalGrowthRate": "number",
        "discountRate": "number"
      }
    }`;
}


export const getCompanyAnalysis = async (companyName: string, isIndian: boolean): Promise<CompanyData> => {
    const market = isIndian ? "Indian (INR)" : "Global (USD)";
    const prompt = `
        You are an expert financial analyst. Perform a detailed financial analysis for the company: "${companyName}" in the ${market} market.
        Use Google Search to find the latest available financial data, including quarterly reports to create TTM (Trailing Twelve Months) or the most recent annual report.
        
        Please provide the entire response as a single JSON object enclosed in a \`\`\`json markdown block.
        The JSON object must strictly adhere to the following structure and include these specific metrics:
        ${getCompanyDataJsonStructure()}

        Important instructions:
        - Financial statement data should be for the last 3 reported fiscal years. If the latest full year is not over, use TTM data for the most recent year and label the year key as such (e.g. "2024 TTM").
        - All financial figures MUST be in millions of the local currency (${isIndian ? "INR" : "USD"}).
        - 'ratios' should be for the most recent full year or TTM. Provide insightful commentary and a relevant industry benchmark.
        - 'ratioHistory' should cover the last 5 years for the specified key ratios.
        - 'news' should contain 3-5 recent and highly relevant news articles with a concise summary.
        - 'valuationAssumptions' should be reasonable, industry-standard assumptions for a DCF valuation based on the company's profile and market conditions. These will be used for a later valuation step.
    `;

    try {
        const response = await ai.models.generateContent({
            // Use a model that is good for complex reasoning and following instructions.
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            }
        });

        const rawText = response.text;
        const jsonText = extractJson(rawText);

        if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
          throw new Error("Model did not return a valid JSON object.");
        }
        
        const data = JSON.parse(jsonText);
        return data as CompanyData;

    } catch(e) {
        console.error("Error fetching company analysis from Gemini:", e);
        const errorMessage = `Failed to retrieve analysis for ${companyName}. The AI model couldn't process the request. This might be due to a temporary issue or an unsupported company. Please try another company.`;
        throw new Error(errorMessage);
    }
};

/**
 * Generates a string representation of the expected JSON structure for valuation results.
 * This is used within the prompt to guide the model's output.
 * @returns {string}
 */
const getMultiModelValuationJsonStructure = (): string => {
    return `{
        "dcf": {
            "intrinsicValue": "number",
            "terminalValue": "number",
            "enterpriseValue": "number",
            "equityValue": "number",
            "impliedSharePrice": "number",
            "projectedFinancials": [{ "year": "number", "revenue": "number", "ebitda": "number", "depreciation": "number", "ebit": "number", "taxes": "number", "nopat": "number", "capex": "number", "changeInNwc": "number", "unleveredFreeCashFlow": "number" }],
            "dcfAnalysis": [{ "year": "number", "unleveredFreeCashFlow": "number", "discountFactor": "number", "presentValue": "number" }]
        },
        "relative": {
            "impliedSharePrice": "number",
            "commentary": "Brief commentary on the choice of comps and multiples.",
            "comparableCompanies": [{ "name": "string", "ticker": "string", "peRatio": "number" }]
        },
        "ddm": {
            "impliedSharePrice": "number",
            "commentary": "Commentary on dividend policy and growth assumptions. State 'N/A' if company doesn't pay dividends."
        },
        "assetBased": {
            "impliedSharePrice": "number",
            "commentary": "Commentary on asset valuation. State 'N/A' if not a suitable method."
        },
        "commentary": "An overall summary synthesizing the results from all models to give a concluding valuation insight.",
        "currentSharePrice": "number",
        "netDebt": "number",
        "sharesOutstanding": "number"
    }`;
}


export const runMultiModelValuation = async (companyData: CompanyData, assumptions: ValuationAssumptions): Promise<MultiModelValuationResult> => {

    const prompt = `
        You are an expert valuation analyst. Perform a multi-model valuation for ${companyData.companyName} (${companyData.ticker}).
        Use the provided company data and valuation assumptions. Use Google Search to get the latest share price, net debt, and shares outstanding figures in millions.

        Company Data Snapshot:
        - Currency: ${companyData.currency}
        - Most recent financials are for year: ${Object.keys(companyData.incomeStatement).sort().pop()!}

        Valuation Assumptions to use for the DCF model:
        ${JSON.stringify(assumptions, null, 2)}

        Please provide the entire response as a single JSON object enclosed in a \`\`\`json markdown block.
        The JSON object must strictly adhere to this structure:
        ${getMultiModelValuationJsonStructure()}

        Important instructions:
        - Ensure all financial values in the JSON response are numbers, not strings (e.g., 1234.5, not "1,234.5").
        - For DCF: Project financials and unlevered free cash flow for 10 years based on the provided assumptions. Calculate the terminal value using the Gordon Growth model. All values must be in millions of ${companyData.currency}.
        - For Relative Valuation: Select 3-5 appropriate publicly traded comparable companies and use a relevant multiple (e.g., P/E, EV/EBITDA). Justify the choice in the commentary.
        - For DDM: If the company pays dividends, perform a Dividend Discount Model valuation. If not, state that it's not applicable in the commentary and return 0 for impliedSharePrice.
        - For Asset-Based: Provide an asset-based valuation. This is often based on book value. If not a suitable methodology for this company (e.g. tech company), state why in commentary and return 0 for impliedSharePrice.
        - The final 'commentary' should synthesize the results from all models to give a concluding valuation summary and a final estimated value range.
    `;

    try {
        const response = await ai.models.generateContent({
            // Use a model that is good for complex reasoning and following instructions.
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            }
        });

        const rawText = response.text;
        const jsonText = extractJson(rawText);

        if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
          throw new Error("Model did not return a valid JSON object.");
        }
        const result = JSON.parse(jsonText);
        
        return result as MultiModelValuationResult;
    } catch(e) {
        console.error("Error running multi-model valuation from Gemini:", e);
        const errorMessage = `Failed to run valuation for ${companyData.companyName}. The AI model couldn't complete the calculation. Please adjust your assumptions or try again later.`;
        throw new Error(errorMessage);
    }
};
