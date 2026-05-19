export {};

declare global {
  interface Window {
    electronAPI?: {
      loadFile: (filePath: string, templateId: string) => Promise<any>;
      cleanData: (dataId: string, rules: any[]) => Promise<any>;
      calculateFormula: (formula: string, params: Record<string, number>) => Promise<any>;
      analyzeData: (dataId: string, template: string) => Promise<any>;
      generateReport: (dataId: string, config: any) => Promise<any>;
      getTemplates: () => Promise<any[]>;
      saveTemplate: (template: any) => Promise<void>;
    };
  }
}