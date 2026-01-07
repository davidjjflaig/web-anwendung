const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:3000/rest';

export type BuchArt = 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

export type Titel = {
  id: number;
  titel: string;
  untertitel: string;
};

export type Abbildung = {
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

export type BuchPage = {
  content: Buch[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
export type TitelCreate = Omit<Titel, 'id'>;
export type AbbildungCreate = Omit<Abbildung, 'id'>;

export type BuchCreate = Omit<Buch, 'id' | 'titel' | 'abbildungen' | 'version'> & {
  titel: TitelCreate;
  abbildungen: AbbildungCreate[];
};

export type BuchPutDto = Omit<BuchCreate, 'titel' | 'abbildungen'>;

export async function findById(id: number): Promise<Buch> {
  const response = await fetch(`${baseURL}/${id}`);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden des Buchs mit der ID ${id}`);
  }
  return await response.json();
}

export async function find(query: Record<string, string> = {}): Promise<BuchPage> {
  const params = new URLSearchParams(query);
  const response = await fetch(`${baseURL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Bücher');
  }
  return await response.json();
}

export async function getToken(user: { username: string; password: string }): Promise<string> {
  const authURL = baseURL.replace('/rest', '/auth/token');
  const response = await fetch(authURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Fehler beim Abrufen des Tokens');
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
    throw new Error('Fehler beim Erstellen des Buchs');
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
      'If-Match': addQuote(ifMatch ?? original.version?.toString() ?? '0'),
    },
    body: JSON.stringify(updatedBuch),
  });
  if (!response.ok) {
    throw new Error('Fehler beim Aktualisieren');
  }
  return response;
}

export async function deleteBuch(id: number, token: string): Promise<Response> {
  const response = await fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Fehler beim Löschen');
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
function addQuote(text: string): string {
  return `"${text}"`;
}
