export interface Inquirer {
  type: string;
  name: string;
  message: string;
  choices?: string[];
  pageSize?: number;
}

