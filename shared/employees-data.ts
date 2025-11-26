export interface EmployeeData {
  employeeId: string;
  userId: string;
  name: string;
  department: string | null;
  position?: string;
  manager: string | null;
  managerId: string | null;
}

export const EMPLOYEES_DATA: EmployeeData[] = [
  {"employeeId": "EMP0001", "userId": "117cc62f-9e38-43cb-9ef7-642bd5869750", "name": "Aleksa Spasić", "department": "Engineering", "manager": "Vladimir Vasic", "managerId": "EMP0037"},
  {"employeeId": "EMP0002", "userId": "3717f80a-2134-4671-ac56-892698e8d500", "name": "Aleksandar Pejaković", "department": "Engineering", "manager": "David Farg", "managerId": "EMP0012"},
  {"employeeId": "EMP0003", "userId": "b580f0cc-6ba3-4d2b-bf8e-21fc1c1ff8f2", "name": "Alexandre Jose Duarte", "department": "Engineering", "manager": "David Farg", "managerId": "EMP0012"},
  {"employeeId": "EMP0004", "userId": "8cefd49c-c73a-4b33-97ea-d95537d3f005", "name": "Aniket Katyal", "department": "Engineering", "manager": "Vladimir Vasic", "managerId": "EMP0037"},
  {"employeeId": "EMP0005", "userId": "ea67db96-24bd-420b-acc8-cb4b5fa7df73", "name": "Anil Dabas", "department": "Engineering", "position": "Director of Engineering", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0006", "userId": "a59a5975-3474-4194-bdd7-27f5b990f3b9", "name": "Artur Mineev", "department": "Design", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0007", "userId": "b4f606e6-664f-4694-8a44-10d045626074", "name": "Batuhan Göbekli", "department": "Engineering", "manager": "David Farg", "managerId": "EMP0012"},
  {"employeeId": "EMP0008", "userId": "338ae0a2-4c11-4b5c-8392-ba587f40a024", "name": "Benjamin Leibeck", "department": null, "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0009", "userId": "b6e2ac9f-0ee6-4182-8b83-2f8d3cd4bb5a", "name": "Charalampos Chatzitheodosiou", "department": "Finance", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0010", "userId": "31f21500-7b1b-4e44-861f-00a05617803a", "name": "Chetan Goyal", "department": "Product", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0011", "userId": "e101ef28-0ed0-4398-a3bc-024a8b510c96", "name": "Daria Turilova", "department": "Design", "manager": "Artur Mineev", "managerId": "EMP0006"},
  {"employeeId": "EMP0012", "userId": "c9e82ec0-7af5-4e1a-9932-3a23d87c0d09", "name": "David Farg", "department": "Engineering", "manager": "Anil Dabas", "managerId": "EMP0005"},
  {"employeeId": "EMP0013", "userId": "138c3d4a-91bf-4e91-bdb0-a03c5831f33a", "name": "Dzmitry Harlach", "department": "Engineering", "manager": "Vladimir Vasic", "managerId": "EMP0037"},
  {"employeeId": "EMP0014", "userId": "561010f5-f4c5-45b0-842d-db96e755ac8e", "name": "Fachrul Choliluddin", "department": "Engineering", "manager": "Anil Dabas", "managerId": "EMP0005"},
  {"employeeId": "EMP0015", "userId": "a013d45a-86b5-4fd7-9e09-18a9c239ac00", "name": "Feras Jalbout", "department": "Executive", "position": "CEO", "manager": null, "managerId": null},
  {"employeeId": "EMP0016", "userId": "7534f611-6a44-422d-a160-b2f0f9d64dc8", "name": "Gautam Palukuri", "department": "Product", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0017", "userId": "6d96dac4-9f96-447a-96dc-5cd0ac25da0c", "name": "Hammad Ashraf", "department": "Growth", "manager": "Rafay Qureshi", "managerId": "EMP0029"},
  {"employeeId": "EMP0018", "userId": "a4552c4f-3a17-42f2-8411-cf0fe862198d", "name": "John Vitalo", "department": "Executive", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0019", "userId": "a0122787-e77c-4cb0-b42f-02e6641c853a", "name": "Merryl Jacob", "department": null, "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0020", "userId": "21a23ba4-0571-45b5-959d-fc60137ec669", "name": "Mohamed Ali Ibrahim Moawad", "department": "Engineering", "manager": "Vladimir Vasic", "managerId": "EMP0037"},
  {"employeeId": "EMP0021", "userId": "d113ee51-a70d-4673-9bc9-91e55d1a3882", "name": "Muna Salah", "department": "Compliance", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0022", "userId": "daae0f86-576b-4155-9717-202180bc90ac", "name": "Nadine Asad", "department": null, "manager": "Rafay Qureshi", "managerId": "EMP0029"},
  {"employeeId": "EMP0023", "userId": "532a943d-39d9-4cf5-9854-806929587d10", "name": "Omar Elderaa", "department": "Design", "manager": "Rafay Qureshi", "managerId": "EMP0029"},
  {"employeeId": "EMP0024", "userId": "ce14a2f4-3236-4002-b63e-d8193c7e1996", "name": "Petar Marković", "department": null, "manager": "Vladimir Vasic", "managerId": "EMP0037"},
  {"employeeId": "EMP0025", "userId": "dcc2f758-bad4-47f5-8af3-0bdf69063366", "name": "Prateek Sharma", "department": "Engineering", "manager": "Zihnican Beğburs", "managerId": "EMP0038"},
  {"employeeId": "EMP0026", "userId": "08d52704-a936-4df5-9560-bd3d716f8127", "name": "Prateek Kushla Nand Saklani", "department": "Engineering", "manager": "Anil Dabas", "managerId": "EMP0005"},
  {"employeeId": "EMP0027", "userId": "58a83b26-a624-497a-928d-92f9efb76428", "name": "Qamar Tahboub", "department": "Growth", "manager": "Rafay Qureshi", "managerId": "EMP0029"},
  {"employeeId": "EMP0028", "userId": "4f057964-caf7-4f64-81dc-07e0ce5fedae", "name": "Raad Alhammouri", "department": "Customer Support", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0029", "userId": "e198ad4e-759d-4bbb-a1db-28bfb1090d69", "name": "Rafay Qureshi", "department": "Growth", "manager": "Feras Jalbout", "managerId": "EMP0015"},
  {"employeeId": "EMP0030", "userId": "69aed0ba-87d7-4234-9908-d90ccfaf65d1", "name": "Rhea Shibu", "department": "Finance", "manager": "Charalampos Chatzitheodosiou", "managerId": "EMP0009"},
  {"employeeId": "EMP0031", "userId": "510d7a32-1417-4cfc-9983-962b212c01c0", "name": "Robert Zuljevic", "department": "Engineering", "manager": "David Farg", "managerId": "EMP0012"},
  {"employeeId": "EMP0032", "userId": "47b732d3-6629-460c-b83f-a95a901b3442", "name": "Shuming Fan", "department": "Growth", "manager": "Rafay Qureshi", "managerId": "EMP0029"},
  {"employeeId": "EMP0033", "userId": "e4871214-032c-48d8-8760-3afe1e87c4ae", "name": "Sidra Fatima", "department": null, "manager": "Rafay Qureshi", "managerId": "EMP0029"},
  {"employeeId": "EMP0034", "userId": "74074fa6-e520-4bfb-a02c-eca26fb5b5a6", "name": "Svetlin Mollov", "department": "Engineering", "manager": "Vladimir Vasic", "managerId": "EMP0037"},
  {"employeeId": "EMP0035", "userId": "41533aa9-1fdf-4bbb-ac7d-2fcc79b3ad14", "name": "Vasa Kotarlić", "department": "Engineering", "manager": "David Farg", "managerId": "EMP0012"},
  {"employeeId": "EMP0036", "userId": "9d71798e-36f3-4b74-9a06-c455ef15a8bf", "name": "Vivek Selvarajan", "department": "Engineering", "manager": "Zihnican Beğburs", "managerId": "EMP0038"},
  {"employeeId": "EMP0037", "userId": "79b50f62-710e-462b-b7ac-903251db6a37", "name": "Vladimir Vasic", "department": "Engineering", "manager": "Anil Dabas", "managerId": "EMP0005"},
  {"employeeId": "EMP0038", "userId": "f13c4216-61dd-405d-9b5b-797d018a69d6", "name": "Zihnican Beğburs", "department": "Engineering", "manager": "Anil Dabas", "managerId": "EMP0005"}
];

export function normalizeEmployeeDepartment(department: string | null): string | null {
  if (!department) return null;
  const deptLower = department.toLowerCase().replace(/\s+/g, '_');
  const mapping: Record<string, string> = {
    'engineering': 'engineering',
    'design': 'design',
    'finance': 'finance',
    'product': 'product',
    'executive': 'executive',
    'growth': 'growth',
    'compliance': 'compliance',
    'customer_support': 'customer_service',
    'customer support': 'customer_service',
  };
  return mapping[deptLower] || deptLower;
}
