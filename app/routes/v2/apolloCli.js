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
  async addResource(resource) {
    console.log('apolloCli.addResource: ' + JSON.stringify(resource));
    const res = await this._client.mutate({
      mutation: gql`
        mutation ($r: JSON!) {
         createResource(resource: $r) {
          id
          org_id
          cluster_id
          createdAt
        }
      }`,
      variables: {
        'r': resource
      }
    });
    console.log('apolloCli.addResource res: ' + JSON.stringify(res));
    return res;
  }

  async findResource(keys) {
    console.log('apolloCli.findResource>: ' + JSON.stringify(keys));
    const result = await this._client.query({
      query: gql`
        query ($org_id: String!, $cluster_id: String!, $selfLink: String!) {
         resourceByKeys(org_id: $org_id, cluster_id: $cluster_id, selfLink: $selfLink) {
          id
          org_id
          cluster_id
          selfLink
        }
      }`,
      variables: {
        org_id: keys.org_id,
        cluster_id: keys.cluster_id,
        selfLink: keys.selfLink
      }
    });
    console.log('apolloCli.findResource<: ' + JSON.stringify(result));
    return result.data.resourceByKeys;
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
