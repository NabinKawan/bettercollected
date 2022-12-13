export interface StandardFormDto {
    formId: string;
    title: string;
    description: string | null | undefined;
    settings: {
        pinned: boolean;
        embedUrl: string;
        customUrl: string;
        provider: string;
        roles: Array<string>;
    };
    questions: {
        questionId: string;
        formId: string;
        title: string;
        description: string | null | undefined;
        type:
            | {
                  type: string;
                  options: Array<any>;
              }
            | any;
        required: boolean | null | undefined;
        isMediaContent: boolean;
        mediaContent: boolean;
        isGroupQuestion: boolean;
        groupQuestion: any;
    };
    createdTime: string | Date;
    modifiedTime: string | Date;
}

export interface StandardFormResponseDto {
    responseId: string;
    formId: string;
    formTitle: string;
    provider: string;
    dataOwnerIdentifierType: string | null | undefined;
    dataOwnerIdentifier: string | null | undefined;
    responses: Array<{ questionId: string; answer: any }>;
    createdAt: string | Date;
    updatedAt: string | Date;
}
