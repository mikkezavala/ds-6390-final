export interface PredictionFormType {
    // Numeric fields
    box_1_wages: number;
    box_3_social_security_wages: number;
    box_4_social_security_tax_withheld: number;
    box_5_medicare_wages: number;
    box_6_medicare_wages_tax_withheld: number;
    box_7_social_security_tips: number;
    box_8_allocated_tips: number;
    box_10_dependent_care_benefits: number;
    box_11_nonqualified_plans: number;
    box_16_1_state_wages: number;
    box_17_1_state_income_tax: number;
    box_18_1_local_wages: number;
    box_19_1_local_income_tax: number;
    box_16_2_state_wages: number;
    box_17_2_state_income_tax: number;
    box_18_2_local_wages: number;
    box_19_2_local_income_tax: number;

    // Boolean flags
    box_13_statutary_employee: boolean;
    box_13_retirement_plan: boolean;
    box_13_third_part_sick_pay: boolean;

    // Categorical / string fields
    box_12a_code: string;
    box_12b_code: string;
    box_12c_code: string;
    box_12d_code: string;
    box_15_1_state: string;
    box_15_2_state: string;
}

export interface PredictionResponse {
    PC1: number
    PC2: number
    PC3: number
    cluster: number
    anomaly: boolean
}

export interface PredictionResponseCluster extends PredictionResponse{
    probability: number;
}

export interface Props {
    userPoint: [number, number, number]
    cluster: number
}
