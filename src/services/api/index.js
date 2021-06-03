import axios from 'axios';
import endpoints from './endpoints.js';

class ApiService {
  async init(config, services) {
    this.config = config;
    this.services = services;
    this.axios = axios.create({
      baseURL: '',
      headers: {},
    });
    if (typeof this.config.baseURL !== 'undefined') {
      this.axios.defaults.baseURL = this.config.baseURL;
    }
    if (typeof this.config.tokenHeader !== 'undefined') {
      this.axios.defaults.tokenHeader = this.config.tokenHeader;
    }
    this.endpoints = {};
    return this;
  }

  setToken(token) {
    if (this.axios.defaults.tokenHeader) {
      if (token) {
        this.axios.defaults.headers[this.axios.defaults.tokenHeader] = token;
      } else {
        delete this.axios.defaults.headers[this.axios.defaults.tokenHeader];
      }
    }
  }

  /**
   * Endpoint на API
   * @param namespace {String}
   * @returns {Common|*}
   */
  endpoint(namespace) {
    if (!this.endpoints[namespace]) {
      const Constructor = endpoints[namespace] || endpoints[this.config.defaultEndpoint];
      this.endpoints[namespace] = new Constructor(this.axios, namespace);
    }
    return this.endpoints[namespace];
  }
}

export default ApiService;