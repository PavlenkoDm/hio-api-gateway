export enum QueueNames {
  AUTH = 'auth',
}

export enum QueueClientsNames {
  AUTH_QUEUE_CLIENT = 'AUTH_QUEUE_CLIENT',
}

export enum AuthQueueEvents {
  SIGN_UP = 'sign_up',
  SIGN_IN = 'sign_in',
  SIGN_OUT = 'sign_out',
  JWT_GUARD = 'jwt_guard',
}

export enum QueueErrors {
  HANDLER_NOT_DEFINED = 'no matching message handler defined',
}
