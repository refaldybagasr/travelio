const { searchBooks, GoogleBooksError } = require('../src/lib/googleBooksClient');

function fakeFetch(response) {
  return async () => response;
}

describe('searchBooks', () => {
  it('normalizes a successful response', async () => {
    const fetchImpl = fakeFetch({
      ok: true,
      json: async () => ({
        totalItems: 1,
        items: [
          {
            id: 'abc123',
            volumeInfo: {
              title: 'Book Title',
              authors: ['Author One'],
              imageLinks: { thumbnail: 'https://example.com/img.jpg' },
              averageRating: 4.5,
              ratingsCount: 120,
            },
          },
        ],
      }),
    });

    const result = await searchBooks({ q: 'test', startIndex: 0, maxResults: 20, fetchImpl });

    expect(result).toEqual({
      totalItems: 1,
      items: [
        {
          id: 'abc123',
          title: 'Book Title',
          authors: ['Author One'],
          thumbnail: 'https://example.com/img.jpg',
          averageRating: 4.5,
          ratingsCount: 120,
        },
      ],
    });
  });

  it('maps missing rating fields to null', async () => {
    const fetchImpl = fakeFetch({
      ok: true,
      json: async () => ({
        totalItems: 1,
        items: [{ id: 'x', volumeInfo: { title: 'No Ratings' } }],
      }),
    });

    const result = await searchBooks({ q: 'test', startIndex: 0, maxResults: 20, fetchImpl });

    expect(result.items[0].averageRating).toBeNull();
    expect(result.items[0].ratingsCount).toBeNull();
    expect(result.items[0].authors).toEqual([]);
    expect(result.items[0].thumbnail).toBeNull();
  });

  it('throws GoogleBooksError when the response is not ok', async () => {
    const fetchImpl = fakeFetch({ ok: false, status: 500 });
    await expect(
      searchBooks({ q: 'test', startIndex: 0, maxResults: 20, fetchImpl })
    ).rejects.toThrow(GoogleBooksError);
  });

  it('throws GoogleBooksError when fetch itself rejects', async () => {
    const fetchImpl = async () => {
      throw new Error('network down');
    };
    await expect(
      searchBooks({ q: 'test', startIndex: 0, maxResults: 20, fetchImpl })
    ).rejects.toThrow(GoogleBooksError);
  });
});
