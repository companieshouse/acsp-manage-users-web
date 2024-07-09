export type AnyRecord = Record<string, unknown>;

export type ViewData = {
    lang: AnyRecord;
    errors?:
      | {
          [key: string]: {
            text: string;
          };
        }
      | undefined;
      companyName?: string;
      backLinkUrl?:string;
      email?:string;
      userRole?:string;
  };
