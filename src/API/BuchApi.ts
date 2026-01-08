/**
 * API-Zugriffsschicht für Buch-Ressourcen.
 *
 * Enthält Typdefinitionen sowie Funktionen zum
 * Laden, Erstellen, Aktualisieren und Löschen von Büchern
 * über das REST-Backend.
 */

/**
 * Basis-URL für alle REST-Anfragen.
 * Wird über VITE_API_URL konfiguriert oder fällt auf localhost zurück.
 */
const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:3000/rest';

/** Mögliche Bucharten. */
export type BuchArt = 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

/** Titel-Informationen eines Buches. */
export type Titel = {
  id: number;
  titel: string;
  untertitel: string;
};

/** Abbildung (z.B. Coverbild) eines Buches. */
export type Abbildung = {
  id: number;
  beschriftung: string;
  contentType: string;
};

/**
 * Vollständiges Buchobjekt, wie es vom Backend geliefert wird.
 */
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

/**
 * Paginierte Buchliste.
 */
export type BuchPage = {
  content: Buch[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

/** DTO für das Erstellen eines neuen Titels. */
export type TitelCreate = Omit<Titel, 'id'>;

/** DTO für das Erstellen einer Abbildung. */
export type AbbildungCreate = Omit<Abbildung, 'id'>;

/**
 * DTO für das Erstellen eines neuen Buchs.
 */
export type BuchCreate = Omit<Buch, 'id' | 'titel' | 'abbildungen' | 'version'> & {
  titel: TitelCreate;
  abbildungen: AbbildungCreate[];
};

/** DTO für PUT-Requests (ohne Titel und Abbildungen). */
export type BuchPutDto = Omit<BuchCreate, 'titel' | 'abbildungen'>;

/**
 * Lädt ein Buch anhand seiner ID.
 *
 * @param id ID des Buchs
 * @returns Das geladene Buch
 * @throws Error wenn das Buch nicht geladen werden kann
 */
export async function findById(id: number): Promise<Buch> {
  const response = await fetch(`${baseURL}/${id}`);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden des Buchs mit der ID ${id}`);
  }
  return await response.json();
}

/**
 * Lädt eine paginierte Liste von Büchern.
 *
 * @param query Optional: Such- und Filterparameter
 * @returns Paginierte Buchliste
 * @throws Error wenn die Bücher nicht geladen werden können
 */
export async function find(query: Record<string, string> = {}): Promise<BuchPage> {
  const params = new URLSearchParams(query);
  const response = await fetch(`${baseURL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Bücher');
  }
  return await response.json();
}

/**
 * Ruft ein JWT-Access-Token für einen Benutzer ab.
 *
 * @param user Benutzername und Passwort
 * @returns Access-Token als String
 * @throws Error wenn die Authentifizierung fehlschlägt
 */
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

/**
 * Erstellt ein neues Buch.
 *
 * @param buch Buchdaten
 * @param token JWT-Access-Token
 * @returns HTTP-Response des Backends
 * @throws Error wenn das Buch nicht erstellt werden kann
 */
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

/**
 * Aktualisiert ein bestehendes Buch.
 *
 * Verwendet optimistisches Locking über den If-Match-Header.
 *
 * @param data Objekt mit Buch-ID, Änderungsdaten und Token
 * @returns HTTP-Response des Backends
 * @throws Error wenn das Buch nicht aktualisiert werden kann
 */
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

/**
 * Löscht ein Buch anhand seiner ID.
 *
 * @param id ID des Buchs
 * @param token JWT-Access-Token
 * @returns HTTP-Response des Backends
 * @throws Error wenn das Buch nicht gelöscht werden kann
 */
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

/**
 * Wandelt ein vollständiges Buchobjekt in ein BuchPutDto um.
 *
 * @param buch Originales Buch
 * @returns BuchPutDto für PUT-Requests
 */
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

/**
 * Fügt einem String doppelte Anführungszeichen hinzu.
 * Wird z.B. für den If-Match-Header verwendet.
 */
function addQuote(text: string): string {
  return `"${text}"`;
}
