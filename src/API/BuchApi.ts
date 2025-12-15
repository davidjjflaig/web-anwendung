const baseURL = 'https://localhost:3000/rest';

type BuchArt = 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

type Titel = {
  id: number;
  title: string;
  untertitel: string;
};
type Abbildung = {
  id: number;
  beschriftung: string;
  contentType: string;
};
export type Buch = {
  id: number;
  isbn: string;
  rating: number;
  art: BuchArt;
  preis: number;
  rabatt: number;
  lieferbar: boolean;
  datum: Date;
  homepage: string;
  schlagwoerter: string[];
  version?: number;
  titel: Titel;
  abbildungen: Abbildung[];
};
type TitelCreate = Omit<Titel, 'id'>;
type AbbildungCreate = Omit<Abbildung, 'id'>;
export type BuchCreate = Omit<Buch, 'id' | 'titel' | 'abbildungen' | 'version'> & {
  titel: TitelCreate;
  abbildungen: AbbildungCreate[];
};
export type BuchPutDto = Omit<BuchCreate, 'titel' | 'abbildungen'>;
export async function findById(id: number): Promise<Buch> {
  const response = await fetch(`${baseURL}/${id}`);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden des Buchs mit der ID ${id}: ${response.statusText}`);
  }
  const buch: Buch = await response.json();
  return buch;
}
export async function find(query: Record<string, string> = {}): Promise<Buch[]> {
  const params = new URLSearchParams(query);
  const response = await fetch(`${baseURL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Bücher: ${response.statusText}`);
  }
  const buecher: Buch[] = await response.json();
  return buecher;
}
export async function getToken(user: { username: string; password: string }): Promise<string> {
  const response = await fetch('https://localhost:3000/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen des Tokens: ${response.statusText}`);
  }
  const data = await response.json();
  return data.access_token;
}
export async function createBuch(buch: BuchCreate, token: string): Promise<Response> {
  const response = await fetch(`${baseURL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buch),
  });
  if (!response.ok) {
    throw new Error(`Fehler beim Erstellen des Buchs: ${response.statusText}`);
  }
  return response;
}
export async function updateBuch(data: {
  id: number;
  buch: Partial<BuchPutDto>;
  token: string;
  ifMatch?: string;
}): Promise<Response> {
  const { id, buch, token, ifMatch } = data;
  const original = await findById(id);
  const buchPutDto = buchtoBuchPutDto(original);
  const updatedBuch = { ...buchPutDto, ...buch };
  const response = await fetch(`${baseURL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'If-Match': ifMatch ?? original.version?.toString() ?? '0',
    },
    body: JSON.stringify(updatedBuch),
  });
  if (!response.ok) {
    throw new Error(`Fehler beim Aktualisieren des Buchs mit der ID ${id}: ${response.statusText}`);
  }
  return response;
}
export async function deleteBuch(id: number, token: string): Promise<Response> {
  const response = await fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Fehler beim Löschen des Buchs mit der ID ${id}: ${response.statusText}`);
  }
  return response;
}
export function buchtoBuchPutDto(buch: Buch): BuchPutDto {
  return {
    isbn: buch.isbn,
    rating: buch.rating,
    art: buch.art,
    preis: buch.preis,
    rabatt: buch.rabatt,
    lieferbar: buch.lieferbar,
    datum: buch.datum,
    homepage: buch.homepage,
    schlagwoerter: buch.schlagwoerter,
  };
}
