import {AppError} from "./ierror";

export class UiError implements AppError {

  private _element:string;
  private _message:string;
  private _type:string;

  constructor(message: string, type: string, element?: string) {
    this._message = message;
    this._type = type;
    this._element = element;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }
  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
  get element(): string {
    return this._element;
  }

  set element(value: string) {
    this._element = value;
  }

  displayString(): string {
    return this.message;
  }

}
