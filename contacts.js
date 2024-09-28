import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

// Define the path to the contacts file
const contactsPath = path.resolve("db", "contacts.json");

// Corrected function name and proper handling of async/await
async function updateContacts(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Failed to update contacts:", error.message);
    throw error; // Re-throw the error after logging
  }
}

// List all contacts
export async function listContacts() {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(contactsList);
  } catch (error) {
    console.error("Failed to read contacts:", error.message);
    throw error; // Re-throw the error after logging
  }
}

// Get a contact by ID
export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactSearchByID = contacts.find((e) => e.id === contactId);
  return contactSearchByID || null; // Return null if not found
}

// Remove a contact by ID
export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((e) => e.id === contactId);
  if (index === -1) {
    console.log(`Contact with ID ${contactId} not found.`);
    return null;
  }
  const [contactDelByID] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return contactDelByID;
}

// Add a new contact
export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}
