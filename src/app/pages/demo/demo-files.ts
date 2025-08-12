// v19, standalone-friendly
export type DemoFileType = 'pdf' | 'image';

export interface DemoFile {
  id: string;
  name: string;     // filename with extension
  label: string;    // friendly name
  type: DemoFileType;
  size?: string;
  pages?: number;
  url: string;      // served from /public/demo-assets/*
  description?: string;
}

export const demoFiles: DemoFile[] = [
  {
    id: 'proposal',
    name: 'Proposal_Project.pdf',
    label: 'Proposal Project',
    type: 'pdf',
    size: '1.2 MB',
    pages: 3,
    url: '/demo-assets/Proposal_Project.pdf',
    description: 'Fictional business proposal (watermarked).'
  },
  {
    id: 'catalog',
    name: 'Product_Catalog.png',
    label: 'Product Catalog',
    type: 'image',
    size: '800 KB',
    url: '/demo-assets/Product_Catalog.png',
    description: 'Tall catalog/infographic (watermarked).'
  },
  {
    id: 'contract',
    name: 'Partnership_Agreement.pdf',
    label: 'Partnership Agreement',
    type: 'pdf',
    size: '900 KB',
    pages: 2,
    url: '/demo-assets/Partnership_Agreement.pdf',
    description: 'Legal-style agreement (watermarked).'
  },
  {
    id: 'report',
    name: 'Quarterly_Report_Q3_2025.pdf',
    label: 'Quarterly Report — Q3 2025',
    type: 'pdf',
    size: '1.6 MB',
    pages: 4,
    url: '/demo-assets/Quarterly_Report_Q3_2025.pdf',
    description: 'Corporate report with placeholder charts.'
  },
  {
    id: 'dashboard',
    name: 'Preview_UI_Dashboard.png',
    label: 'UI Dashboard Preview',
    type: 'image',
    size: '1.1 MB',
    url: '/demo-assets/Preview_UI_Dashboard.png',
    description: 'Analytics dashboard mock (watermarked).'
  }
];
