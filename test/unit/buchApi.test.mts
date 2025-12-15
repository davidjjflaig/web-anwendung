import { describe, test, expect } from 'vitest';
import {
  find,
  findById,
  createBuch,
  getToken,
  BuchCreate,
  updateBuch,
  deleteBuch,
  BuchPutDto,
} from '../../src/api/buchApi';

describe('Buch API Tests', () => {
  test.concurrent('should find book by ID', async () => {
    const id = 1;

    const buch = await findById(id);

    expect(buch).toBeDefined();
    expect(buch.id).toBe(id);
  });
  test.concurrent('should throw error for non-existing book ID', async () => {
    const nonExistingId = 9999;

    const buch = await findById(nonExistingId);

    expect(buch).toBeUndefined();
  });
  test.concurrent('Buch mit Suchparametern finden', async () => {
    // Keine Ahnung wie ein echtes Buch in der db heißen könnte
    const query = { titel: 'Testbuch' };

    const buecher = await find(query);

    expect(buecher).toBeDefined();
    expect(buecher.length).toBeGreaterThan(0);
    expect(buecher[0].titel.title).toContain('Testbuch');
  });
  test.concurrent('should return empty array for no matching books', async () => {
    const query = { titel: 'NonExistingBook' };

    const buecher = await find(query);

    expect(buecher).toBeDefined();
    expect(buecher.length).toBe(0);
  });
  test.concurrent('should create a new book', async () => {
    const newBuch: BuchCreate = {
      isbn: '1234567890',
      rating: 5,
      art: 'HARDCOVER',
      preis: 29.99,
      rabatt: 0,
      lieferbar: true,
      datum: new Date(),
      homepage: 'https://example.com',
      schlagwoerter: ['Test', 'Buch'],
      titel: { title: 'Neues Testbuch', untertitel: 'Ein Untertitel' },
      abbildungen: [{ beschriftung: 'Cover', contentType: 'image/png' }],
    };
    const token = await getToken({ username: 'admin', password: 'p' });

    const createdBuch = await createBuch(newBuch, token);

    expect(createdBuch).toBeDefined();
    expect(createdBuch.status).toBe(201);
  });
  test.concurrent('should fail to create a new book with invalid token', async () => {
    const newBuch: BuchCreate = {
      isbn: '1234567890',
      rating: 5,
      art: 'HARDCOVER',
      preis: 29.99,
      rabatt: 0,
      lieferbar: true,
      datum: new Date(),
      homepage: 'https://example.com',
      schlagwoerter: ['Test', 'Buch'],
      titel: { title: 'Neues Testbuch', untertitel: 'Ein Untertitel' },
      abbildungen: [{ beschriftung: 'Cover', contentType: 'image/png' }],
    };
    const invalidToken = 'invalid.token.here';

    const createdBuch = await createBuch(newBuch, invalidToken);

    expect(createdBuch).toBeDefined();
    expect(createdBuch.status).toBe(401);
  });
  test.concurrent('should update an existing book', async () => {
    const idToUpdate = 1;
    const updatedBuchData: Partial<BuchPutDto> = {
      preis: 24.99,
      rabatt: 10,
    };
    const ifMatch = '0';

    const token = await getToken({ username: 'admin', password: 'p' });
    const updatedBuch = await updateBuch({ id: idToUpdate, buch: updatedBuchData, token, ifMatch });

    expect(updatedBuch).toBeDefined();
    expect(updatedBuch.status).toBe(204);
  });

  test.concurrent('should fail to update a book with invalid id', async () => {
    const invalidId = 9999;
    const updatedBuchData: Partial<BuchCreate> = {
      preis: 24.99,
      rabatt: 10,
    };
    const token = await getToken({ username: 'admin', password: 'p' });
    const updatedBuch = await updateBuch({ id: invalidId, buch: updatedBuchData, token });

    expect(updatedBuch).toBeDefined();
    expect(updatedBuch.status).toBe(404);
  });
  test.concurrent('should delete book', async () => {
    const idToDelete = 1;
    const token = await getToken({ username: 'admin', password: 'p' });
    const deleteResponse = await deleteBuch(idToDelete, token);

    expect(deleteResponse).toBeDefined();
    expect(deleteResponse.status).toBe(204);
  });
});
