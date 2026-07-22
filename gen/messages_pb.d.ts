// package: christiangeorgelucas.spreadsheet_formula_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class CellValue extends jspb.Message {
  getRow(): number;
  setRow(value: number): void;

  getCol(): number;
  setCol(value: number): void;

  getSheet(): string;
  setSheet(value: string): void;

  getType(): string;
  setType(value: string): void;

  getStringValue(): string;
  setStringValue(value: string): void;

  getNumberValue(): number;
  setNumberValue(value: number): void;

  getBoolValue(): boolean;
  setBoolValue(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CellValue.AsObject;
  static toObject(includeInstance: boolean, msg: CellValue): CellValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CellValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CellValue;
  static deserializeBinaryFromReader(message: CellValue, reader: jspb.BinaryReader): CellValue;
}

export namespace CellValue {
  export type AsObject = {
    row: number,
    col: number,
    sheet: string,
    type: string,
    stringValue: string,
    numberValue: number,
    boolValue: boolean,
  }
}

export class FormulaContext extends jspb.Message {
  clearCellsList(): void;
  getCellsList(): Array<CellValue>;
  setCellsList(value: Array<CellValue>): void;
  addCells(value?: CellValue, index?: number): CellValue;

  getPositionRow(): number;
  setPositionRow(value: number): void;

  getPositionCol(): number;
  setPositionCol(value: number): void;

  getSheet(): string;
  setSheet(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FormulaContext.AsObject;
  static toObject(includeInstance: boolean, msg: FormulaContext): FormulaContext.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FormulaContext, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FormulaContext;
  static deserializeBinaryFromReader(message: FormulaContext, reader: jspb.BinaryReader): FormulaContext;
}

export namespace FormulaContext {
  export type AsObject = {
    cellsList: Array<CellValue.AsObject>,
    positionRow: number,
    positionCol: number,
    sheet: string,
  }
}

export class EvaluateRequest extends jspb.Message {
  getFormula(): string;
  setFormula(value: string): void;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): FormulaContext | undefined;
  setContext(value?: FormulaContext): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateRequest): EvaluateRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateRequest;
  static deserializeBinaryFromReader(message: EvaluateRequest, reader: jspb.BinaryReader): EvaluateRequest;
}

export namespace EvaluateRequest {
  export type AsObject = {
    formula: string,
    context?: FormulaContext.AsObject,
  }
}

export class ScalarValue extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getNumberValue(): number;
  setNumberValue(value: number): void;

  getStringValue(): string;
  setStringValue(value: string): void;

  getBoolValue(): boolean;
  setBoolValue(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScalarValue.AsObject;
  static toObject(includeInstance: boolean, msg: ScalarValue): ScalarValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScalarValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScalarValue;
  static deserializeBinaryFromReader(message: ScalarValue, reader: jspb.BinaryReader): ScalarValue;
}

export namespace ScalarValue {
  export type AsObject = {
    type: string,
    numberValue: number,
    stringValue: string,
    boolValue: boolean,
  }
}

export class EvaluateResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getIsArray(): boolean;
  setIsArray(value: boolean): void;

  hasScalar(): boolean;
  clearScalar(): void;
  getScalar(): ScalarValue | undefined;
  setScalar(value?: ScalarValue): void;

  clearArrayValuesList(): void;
  getArrayValuesList(): Array<ScalarValue>;
  setArrayValuesList(value: Array<ScalarValue>): void;
  addArrayValues(value?: ScalarValue, index?: number): ScalarValue;

  getArrayRows(): number;
  setArrayRows(value: number): void;

  getArrayCols(): number;
  setArrayCols(value: number): void;

  getError(): string;
  setError(value: string): void;

  getErrorCode(): string;
  setErrorCode(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateResult.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateResult): EvaluateResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateResult;
  static deserializeBinaryFromReader(message: EvaluateResult, reader: jspb.BinaryReader): EvaluateResult;
}

export namespace EvaluateResult {
  export type AsObject = {
    ok: boolean,
    isArray: boolean,
    scalar?: ScalarValue.AsObject,
    arrayValuesList: Array<ScalarValue.AsObject>,
    arrayRows: number,
    arrayCols: number,
    error: string,
    errorCode: string,
  }
}

export class EvaluateBatchRequest extends jspb.Message {
  clearFormulasList(): void;
  getFormulasList(): Array<string>;
  setFormulasList(value: Array<string>): void;
  addFormulas(value: string, index?: number): string;

  hasContext(): boolean;
  clearContext(): void;
  getContext(): FormulaContext | undefined;
  setContext(value?: FormulaContext): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateBatchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateBatchRequest): EvaluateBatchRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateBatchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateBatchRequest;
  static deserializeBinaryFromReader(message: EvaluateBatchRequest, reader: jspb.BinaryReader): EvaluateBatchRequest;
}

export namespace EvaluateBatchRequest {
  export type AsObject = {
    formulasList: Array<string>,
    context?: FormulaContext.AsObject,
  }
}

export class EvaluateBatchResult extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<EvaluateResult>;
  setResultsList(value: Array<EvaluateResult>): void;
  addResults(value?: EvaluateResult, index?: number): EvaluateResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvaluateBatchResult.AsObject;
  static toObject(includeInstance: boolean, msg: EvaluateBatchResult): EvaluateBatchResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvaluateBatchResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvaluateBatchResult;
  static deserializeBinaryFromReader(message: EvaluateBatchResult, reader: jspb.BinaryReader): EvaluateBatchResult;
}

export namespace EvaluateBatchResult {
  export type AsObject = {
    resultsList: Array<EvaluateResult.AsObject>,
  }
}

export class ValidateFormulaRequest extends jspb.Message {
  getFormula(): string;
  setFormula(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateFormulaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateFormulaRequest): ValidateFormulaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateFormulaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateFormulaRequest;
  static deserializeBinaryFromReader(message: ValidateFormulaRequest, reader: jspb.BinaryReader): ValidateFormulaRequest;
}

export namespace ValidateFormulaRequest {
  export type AsObject = {
    formula: string,
  }
}

export class ValidateFormulaResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getErrorLine(): number;
  setErrorLine(value: number): void;

  getErrorColumn(): number;
  setErrorColumn(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateFormulaResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateFormulaResult): ValidateFormulaResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateFormulaResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateFormulaResult;
  static deserializeBinaryFromReader(message: ValidateFormulaResult, reader: jspb.BinaryReader): ValidateFormulaResult;
}

export namespace ValidateFormulaResult {
  export type AsObject = {
    valid: boolean,
    error: string,
    errorLine: number,
    errorColumn: number,
  }
}

export class CellRef extends jspb.Message {
  getSheet(): string;
  setSheet(value: string): void;

  getRow(): number;
  setRow(value: number): void;

  getCol(): number;
  setCol(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CellRef.AsObject;
  static toObject(includeInstance: boolean, msg: CellRef): CellRef.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CellRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CellRef;
  static deserializeBinaryFromReader(message: CellRef, reader: jspb.BinaryReader): CellRef;
}

export namespace CellRef {
  export type AsObject = {
    sheet: string,
    row: number,
    col: number,
  }
}

export class RangeRef extends jspb.Message {
  getSheet(): string;
  setSheet(value: string): void;

  getFromRow(): number;
  setFromRow(value: number): void;

  getFromCol(): number;
  setFromCol(value: number): void;

  getToRow(): number;
  setToRow(value: number): void;

  getToCol(): number;
  setToCol(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RangeRef.AsObject;
  static toObject(includeInstance: boolean, msg: RangeRef): RangeRef.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RangeRef, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RangeRef;
  static deserializeBinaryFromReader(message: RangeRef, reader: jspb.BinaryReader): RangeRef;
}

export namespace RangeRef {
  export type AsObject = {
    sheet: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
  }
}

export class ExtractReferencesRequest extends jspb.Message {
  getFormula(): string;
  setFormula(value: string): void;

  getSheet(): string;
  setSheet(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractReferencesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractReferencesRequest): ExtractReferencesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractReferencesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractReferencesRequest;
  static deserializeBinaryFromReader(message: ExtractReferencesRequest, reader: jspb.BinaryReader): ExtractReferencesRequest;
}

export namespace ExtractReferencesRequest {
  export type AsObject = {
    formula: string,
    sheet: string,
  }
}

export class ExtractReferencesResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  clearCellRefsList(): void;
  getCellRefsList(): Array<CellRef>;
  setCellRefsList(value: Array<CellRef>): void;
  addCellRefs(value?: CellRef, index?: number): CellRef;

  clearRangeRefsList(): void;
  getRangeRefsList(): Array<RangeRef>;
  setRangeRefsList(value: Array<RangeRef>): void;
  addRangeRefs(value?: RangeRef, index?: number): RangeRef;

  clearFunctionNamesList(): void;
  getFunctionNamesList(): Array<string>;
  setFunctionNamesList(value: Array<string>): void;
  addFunctionNames(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractReferencesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractReferencesResult): ExtractReferencesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractReferencesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractReferencesResult;
  static deserializeBinaryFromReader(message: ExtractReferencesResult, reader: jspb.BinaryReader): ExtractReferencesResult;
}

export namespace ExtractReferencesResult {
  export type AsObject = {
    ok: boolean,
    cellRefsList: Array<CellRef.AsObject>,
    rangeRefsList: Array<RangeRef.AsObject>,
    functionNamesList: Array<string>,
    error: string,
  }
}

export class ListSupportedFunctionsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSupportedFunctionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListSupportedFunctionsRequest): ListSupportedFunctionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListSupportedFunctionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSupportedFunctionsRequest;
  static deserializeBinaryFromReader(message: ListSupportedFunctionsRequest, reader: jspb.BinaryReader): ListSupportedFunctionsRequest;
}

export namespace ListSupportedFunctionsRequest {
  export type AsObject = {
  }
}

export class FunctionInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getCategory(): string;
  setCategory(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FunctionInfo.AsObject;
  static toObject(includeInstance: boolean, msg: FunctionInfo): FunctionInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FunctionInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FunctionInfo;
  static deserializeBinaryFromReader(message: FunctionInfo, reader: jspb.BinaryReader): FunctionInfo;
}

export namespace FunctionInfo {
  export type AsObject = {
    name: string,
    category: string,
  }
}

export class ListSupportedFunctionsResult extends jspb.Message {
  clearFunctionsList(): void;
  getFunctionsList(): Array<FunctionInfo>;
  setFunctionsList(value: Array<FunctionInfo>): void;
  addFunctions(value?: FunctionInfo, index?: number): FunctionInfo;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSupportedFunctionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListSupportedFunctionsResult): ListSupportedFunctionsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListSupportedFunctionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSupportedFunctionsResult;
  static deserializeBinaryFromReader(message: ListSupportedFunctionsResult, reader: jspb.BinaryReader): ListSupportedFunctionsResult;
}

export namespace ListSupportedFunctionsResult {
  export type AsObject = {
    functionsList: Array<FunctionInfo.AsObject>,
    count: number,
  }
}

export class FormatValueRequest extends jspb.Message {
  getFormatCode(): string;
  setFormatCode(value: string): void;

  hasValue(): boolean;
  clearValue(): void;
  getValue(): ScalarValue | undefined;
  setValue(value?: ScalarValue): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FormatValueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FormatValueRequest): FormatValueRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FormatValueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FormatValueRequest;
  static deserializeBinaryFromReader(message: FormatValueRequest, reader: jspb.BinaryReader): FormatValueRequest;
}

export namespace FormatValueRequest {
  export type AsObject = {
    formatCode: string,
    value?: ScalarValue.AsObject,
  }
}

export class FormatValueResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getFormatted(): string;
  setFormatted(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FormatValueResult.AsObject;
  static toObject(includeInstance: boolean, msg: FormatValueResult): FormatValueResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FormatValueResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FormatValueResult;
  static deserializeBinaryFromReader(message: FormatValueResult, reader: jspb.BinaryReader): FormatValueResult;
}

export namespace FormatValueResult {
  export type AsObject = {
    ok: boolean,
    formatted: string,
    error: string,
  }
}

export class ConvertCellReferenceRequest extends jspb.Message {
  getA1Ref(): string;
  setA1Ref(value: string): void;

  getRow(): number;
  setRow(value: number): void;

  getCol(): number;
  setCol(value: number): void;

  getIsRange(): boolean;
  setIsRange(value: boolean): void;

  getToRow(): number;
  setToRow(value: number): void;

  getToCol(): number;
  setToCol(value: number): void;

  getSheet(): string;
  setSheet(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConvertCellReferenceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConvertCellReferenceRequest): ConvertCellReferenceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConvertCellReferenceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConvertCellReferenceRequest;
  static deserializeBinaryFromReader(message: ConvertCellReferenceRequest, reader: jspb.BinaryReader): ConvertCellReferenceRequest;
}

export namespace ConvertCellReferenceRequest {
  export type AsObject = {
    a1Ref: string,
    row: number,
    col: number,
    isRange: boolean,
    toRow: number,
    toCol: number,
    sheet: string,
  }
}

export class ConvertCellReferenceResult extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getSheet(): string;
  setSheet(value: string): void;

  getRow(): number;
  setRow(value: number): void;

  getCol(): number;
  setCol(value: number): void;

  getIsRange(): boolean;
  setIsRange(value: boolean): void;

  getToRow(): number;
  setToRow(value: number): void;

  getToCol(): number;
  setToCol(value: number): void;

  getA1Ref(): string;
  setA1Ref(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConvertCellReferenceResult.AsObject;
  static toObject(includeInstance: boolean, msg: ConvertCellReferenceResult): ConvertCellReferenceResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConvertCellReferenceResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConvertCellReferenceResult;
  static deserializeBinaryFromReader(message: ConvertCellReferenceResult, reader: jspb.BinaryReader): ConvertCellReferenceResult;
}

export namespace ConvertCellReferenceResult {
  export type AsObject = {
    ok: boolean,
    sheet: string,
    row: number,
    col: number,
    isRange: boolean,
    toRow: number,
    toCol: number,
    a1Ref: string,
    error: string,
  }
}

