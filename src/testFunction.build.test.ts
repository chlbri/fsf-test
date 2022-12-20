import { createFunction } from '@bemedev/fsf';
import { test } from 'vitest';
import testFunction from '../lib/index';

type Context = {
  apiKey?: string;
  apiUrl?: string;
  url?: string;
};

type Events = { products?: string[]; categories?: string[] };

const queryMachine = createFunction(
  {
    schema: {
      context: {} as Context,
      events: {} as Events,
      data: {} as string,
    },
    context: {},
    initial: 'preferences',
    states: {
      preferences: {
        always: {
          actions: ['setUrl', 'setApiKey', 'startUrl'],
          target: 'categories',
        },
      },
      categories: {
        always: [
          {
            cond: 'hasCategories',
            target: 'products',
            actions: 'setCategories',
          },
          'products',
        ],
      },
      products: {
        always: [
          {
            cond: 'hasProducts',
            target: 'final',
            actions: 'setProducts',
          },
          'final',
        ],
      },
      final: {
        data: 'query',
      },
    },
  },
  {
    // strict: true,
    actions: {
      setApiKey: ctx => {
        ctx.apiKey = '123';
      },
      setUrl: ctx => {
        ctx.apiUrl = 'https://example.com';
      },
      startUrl: ctx => {
        const { apiUrl, apiKey } = ctx;
        ctx.url = `${apiUrl}?apikey=${apiKey}`;
      },
      setCategories: (ctx, { categories }) => {
        const _categories = categories?.join(',');
        ctx.url += `&categories=${_categories}`;
      },
      setProducts: (ctx, { products }) => {
        const _products = products?.join(',');
        ctx.url += `&products=${_products}`;
      },
    },
    guards: {
      hasCategories: (_, { categories }) =>
        !!categories && categories.length > 0,
      hasProducts: (_, { products }) => !!products && products.length > 0,
    },
    datas: {
      query: ctx => ctx.url,
    },
  },
);

const testFunc = testFunction(queryMachine);

test('#1: no args', () => {
  testFunc().test(data => data === 'https://example.com?apikey=123');
});

test('#2: categories', () => {
  testFunc({ categories: ['a', 'b'] }).test(
    data => data === 'https://example.com?apikey=123&categories=a,b',
  );
});

test('#3: products', () => {
  testFunc({ products: ['a', 'b'] }).test(
    data => data === 'https://example.com?apikey=123&products=a,b',
  );
});

test('#4: categories and products', () => {
  testFunc({ products: ['a', 'b'], categories: ['c', 'd'] }).test(data => {
    return (
      data === 'https://example.com?apikey=123&categories=c,d&products=a,b'
    );
  });
});
