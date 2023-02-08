export interface StandardFormQuestionDto {
    questionId: string;
    formId?: string;
    title: string;
    description?: string | null;
    type:
        | {
              type: string;
              options: Array<any>;
          }
        | any;
    required: boolean | null | undefined;
    isMediaContent?: boolean;
    mediaContent?: boolean;
    isGroupQuestion?: boolean;
    groupQuestion?: any;
    answer?: any;
}

export interface StandardFormDto {
    formId: string;
    title: string;
    description: string | null | undefined;
    settings: {
        pinned: boolean;
        embedUrl?: string;
        customUrl: string;
        private?: boolean;
        provider: string;
        roles?: Array<string>;
    };
    questions: Array<StandardFormQuestionDto>;
    createdTime: string | Date;
    modifiedTime: string | Date;
}

export interface StandardFormResponseDto {
    responseId: string;
    formId: string;
    formTitle: string;
    formCustomUrl: string;
    provider: string;
    dataOwnerIdentifierType: string | null | undefined;
    dataOwnerIdentifier: string | null | undefined;
    responses: Array<{ questionId: string; answer: any }>;
    createdAt: string | Date;
    updatedAt: string | Date;
}
