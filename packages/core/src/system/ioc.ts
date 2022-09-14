import awillix, { Resolver } from 'awilix';

const container = awillix.createContainer();

export function registerResolver(name: string, registration: Resolver<unknown>) {
  container.register(name, registration);
}

export function get<T>(name: string) {
  container.resolve<T>(name);
}
