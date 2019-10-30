//import { ApolloClient } from 'apollo-client';
//import { InMemoryCache } from 'apollo-cache-inmemory';
//import { HttpLink } from 'apollo-link-http';
//import gql from 'graphql-tag';

const fetch = require('node-fetch');
var { ApolloClient } = require('apollo-client');
var { InMemoryCache } = require('apollo-cache-inmemory');
var { createHttpLink } = require('apollo-link-http');
var gql = require('graphql-tag');

module.exports = class ApolloCli {

  constructor(options) {
    const cache = new InMemoryCache();
    const link = createHttpLink({ uri: options.graphql_url, fetch: fetch});
    this._client = new ApolloClient({
      cache,
      link
    });
    this.logger = options.logger;
  }

  //add a new resource to db
  async upsertResource(resource) {
    console.log('apolloCli.upsertResource>: ' + JSON.stringify(resource));
    const res = await this._client.mutate({
      mutation: gql`
        mutation ($r: JSON!) {
         upsertResource(resource: $r) {
          id
          org_id
          cluster_id
          selfLink
          deleted
          createdAt
        }
      }`,
      variables: {
        'r': resource
      }
    });
    console.log('apolloCli.upsertResource<: ' + JSON.stringify(res));
    return res;
  }

  //mark a resource as deleted
  async deleteResource(resource) {
    console.log('apolloCli.deleteResource>: ' + JSON.stringify(resource));
    const res = await this._client.mutate({
      mutation: gql`
        mutation ($r: JSON!) {
         deleteResource(resource: $r)
      }`,
      variables: {
        'r': resource
      }
    });
    console.log('apolloCli.deleteResource<: ' + JSON.stringify(res));
    return res;
  }
};
