import {Prediction, TaxShape, TreeNode} from "../types/common";

export const boxLabels: Record<string, string> = {
    box_1_wages: "Wages (Box 1)",
    box_3_social_security_wages: "Social Security Wages (Box 3)",
    box_4_social_security_tax_withheld: "SS Tax Withheld (Box 4)",
    box_5_medicare_wages: "Medicare Wages (Box 5)",
    box_6_medicare_wages_tax_withheld: "Medicare Tax (Box 6)",
    box_7_social_security_tips: "SS Tips (Box 7)",
    box_8_allocated_tips: "Allocated Tips (Box 8)",
    box_10_dependent_care_benefits: "Dependent Care (Box 10)",
    box_11_nonqualified_plans: "Nonqualified Plans (Box 11)",
    box_13_statutary_employee: "Statutory Employee (Box 13)",
    box_13_retirement_plan: "Retirement Plan (Box 13)",
    box_13_third_part_sick_pay: "Third-Party Sick Pay (Box 13)",
    box_16_1_state_wages: "State Wages 1 (Box 16)",
    box_17_1_state_income_tax: "State Tax 1 (Box 17)",
    box_18_1_local_wages: "Local Wages 1 (Box 18)",
    box_19_1_local_income_tax: "Local Tax 1 (Box 19)",
    box_16_2_state_wages: "State Wages 2 (Box 16)",
    box_17_2_state_income_tax: "State Tax 2 (Box 17)",
    box_18_2_local_wages: "Local Wages 2 (Box 18)",
    box_19_2_local_income_tax: "Local Tax 2 (Box 19)",
    box_12a_code: "Box 12a Code",
    box_12b_code: "Box 12b Code",
    box_12c_code: "Box 12c Code",
    box_12d_code: "Box 12d Code",
    box_15_1_state: "State 1 (Box 15)",
    box_15_2_state: "State 2 (Box 15)",
}

export const defaultValues: Prediction = {
    box_1_wages: 50000,
    box_3_social_security_wages: 40000,
    box_4_social_security_tax_withheld: 2000,
    box_5_medicare_wages: 40000,
    box_6_medicare_wages_tax_withheld: 1000,
    box_7_social_security_tips: 0,
    box_8_allocated_tips: 0,
    box_10_dependent_care_benefits: 0,
    box_11_nonqualified_plans: 0,
    box_13_statutary_employee: false,
    box_13_retirement_plan: true,
    box_13_third_part_sick_pay: false,
    box_16_1_state_wages: 30000,
    box_17_1_state_income_tax: 1000,
    box_18_1_local_wages: 0,
    box_19_1_local_income_tax: 0,
    box_16_2_state_wages: 0,
    box_17_2_state_income_tax: 0,
    box_18_2_local_wages: 0,
    box_19_2_local_income_tax: 0,
    box_12a_code: "None",
    box_12b_code: "None",
    box_12c_code: "None",
    box_12d_code: "None",
    box_15_1_state: "CA",
    box_15_2_state: "None"
}

export const US_STATE_CODES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "None"
]

const toNode = (name: string, value: any): TreeNode =>
    typeof value === "number"
        ? {name, value}
        : {name, children: Object.entries(value).map(([k, v]) => toNode(k, v))}

export const buildTree = (data: TaxShape[]): TreeNode => {
    const tree: any = {}

    for (const row of data) {
        const state = row.box_15_1_state || "Unknown"
        const retire = row.box_13_retirement_plan ? "Retirement" : "No Retirement"
        //const code = row.box_12a_code || "None"
        const anomaly = row.anomaly_consensus ? "Anomaly" : "Normal"

        tree[state] ??= {}
        tree[state][retire] ??= {}
        tree[state][retire][anomaly] ??= 0
        tree[state][retire][anomaly] += 1
    }

    return toNode("Taxpayer Tree", tree)
}