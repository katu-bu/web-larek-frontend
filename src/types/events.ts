export interface IEventEmitter {
  emit: (event: string, data: unknown) => void;
}