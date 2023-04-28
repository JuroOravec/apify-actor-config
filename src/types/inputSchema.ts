import type { ArrVal } from '../utils/types';

export const FIELD_TYPE = ['string', 'array', 'object', 'boolean', 'integer'] as const;
export type FieldType = ArrVal<typeof FIELD_TYPE>;

export const STRING_EDITOR_TYPE = ['textfield', 'textarea', 'javascript', 'select', 'datepicker', 'hidden'] as const; // prettier-ignore
export type StringEditorType = ArrVal<typeof STRING_EDITOR_TYPE>;

export const BOOLEAN_EDITOR_TYPE = ['checkbox', 'hidden'] as const; // prettier-ignore
export type BooleanEditorType = ArrVal<typeof BOOLEAN_EDITOR_TYPE>;

export const INTEGER_EDITOR_TYPE = ['number', 'hidden'] as const; // prettier-ignore
export type IntegerEditorType = ArrVal<typeof INTEGER_EDITOR_TYPE>;

export const OBJECT_EDITOR_TYPE = ['json', 'proxy', 'hidden'] as const; // prettier-ignore
export type ObjectEditorType = ArrVal<typeof OBJECT_EDITOR_TYPE>;

export const ARRAY_EDITOR_TYPE = ['json', 'requestListSources', 'pseudoUrls', 'globs', 'keyValue', 'stringList', 'hidden'] as const; // prettier-ignore
export type ArrayEditorType = ArrVal<typeof ARRAY_EDITOR_TYPE>;

/** See https://docs.apify.com/platform/actors/development/input-schema */
export interface ActorInputSchema<TProps extends Record<string, Field> = Record<string, Field>> {
  /**
   * Any text describing your input schema.
   *
   * Example: `'Cheerio Crawler input'`
   */
  title: string;
  /**
   * Help text for the input that will be displayed above the UI fields.
   */
  description?: string;
  /** This is fixed and must be set to string object. */
  type: 'object';
  /**
   * The version of the specification against which your schema is written.
   * Currently, only version 1 is out.
   */
  schemaVersion: 1;
  /** This is an object mapping each field key to its specification. */
  properties: TProps;
  /** An array of field keys that are required. */
  required?: (keyof TProps)[];
}

/** See https://docs.apify.com/platform/actors/development/input-schema#fields */
export type Field = StringField | BooleanField | IntegerField | ObjectField | ArrayField;

interface BaseField {
  /** Allowed type for the input value. Cannot be mixed. */
  type: FieldType;
  /** Title of the field in UI. */
  title: string;
  /** Description of the field that will be displayed as help text in Actor input UI. */
  description: string;
  /**
   * If this property is set, then all fields following this field
   * (this field included) will be separated into a collapsible section
   * with the value set as its caption. The section ends at the last field
   * or the next field which has the sectionCaption property set.
   */
  sectionCaption?: string;
  /**
   * If the sectionCaption property is set, then you can use this property to
   * provide additional description to the section. The description will be
   * visible right under the caption when the section is open.
   */
  sectionDescription?: string;
  /** Specifies whether null is an allowed value. */
  nullable?: boolean;
}

/** Value of these fields is dependent on the field type */
interface BaseFieldTypedProps<T> {
  /** Default value that will be used when no value is provided. */
  default?: T;
  /**
   * Value that will be prefilled in the actor input interface.
   * Only the boolean type doesn't support prefill property.
   */
  prefill?: T;
  /**
   * Sample value of this field for the actor to be displayed when
   * actor is published in Apify Store.
   */
  example?: T;
}

/**
 * See https://docs.apify.com/platform/actors/development/input-schema#string
 *
 * Example of code input:
 *
 * ```json
 * {
 *   "title": "Page function",
 *   "type": "string",
 *   "description": "Function executed for each request",
 *   "editor": "javascript",
 *   "prefill": "async () => { return $('title').text(); }",
 * }
 * ```
 *
 * Example of country selection using a select input:
 *
 * ```json
 * {
 *   "title": "Country",
 *   "type": "string",
 *   "description": "Select your country",
 *   "editor": "select",
 *   "default": "us",
 *   "enum": ["us", "de", "fr"],
 *   "enumTitles": ["USA", "Germany", "France"]
 * }
 * ```
 */
export type StringField<TVal extends string = string, TEnumTitles extends string = string> =
  | SelectStringField<TVal, TEnumTitles>
  | TextStringField<TVal>
  | BaseStringField<TVal>;

interface BaseStringField<TVal extends string = string>
  extends BaseField,
    BaseFieldTypedProps<TVal> {
  type: 'string';
  /** Visual editor used for the input field. */
  editor: Exclude<StringEditorType, 'select' | 'textarea' | 'textfield'>;
  /**
   * Regular expression that will be used to validate the input.
   * If validation fails, the actor will not run.
   *
   * NOTE: When using escape characters `\` for the regular expression
   * in the pattern field, be sure to escape them to avoid invalid
   * JSON issues. For example, the regular expression
   *
   * `https:\/\/(www\.)?apify\.com\/.+`
   *
   * would become
   *
   * `https:\\/\\/(www\\.)?apify\\.com\\/.+`
   */
  pattern?: string;
  /** Minimum length of the string. */
  minLength?: number;
  /** Maximum length of the string. */
  maxLength?: number;
}

interface SelectStringField<TEnum extends string = string, TEnumTitles extends string = string>
  extends Omit<BaseStringField, 'editor' | 'default' | 'prefill' | 'example'>,
    BaseFieldTypedProps<TEnum> {
  editor: 'select';
  /**
   * Using this field, you can limit values
   * to the given array of strings.
   * Input will be displayed as select box.
   */
  enum: TEnum[] | readonly TEnum[];
  /** Titles for the enum keys described. */
  enumTitles?: TEnumTitles[] | readonly TEnumTitles[];
}

interface TextStringField<TVal extends string = string>
  extends Omit<BaseStringField<TVal>, 'editor'> {
  editor: 'textfield' | 'textarea';
  /**
   * Specifies whether the input field will be stored encrypted.
   * Only available with textfield and textarea editors.
   */
  isSecret?: boolean;
}

/**
 * See https://docs.apify.com/platform/actors/development/input-schema#boolean
 *
 * Example options with group caption:
 *
 * ```json
 * {
 *   "title": "Verbose log",
 *   "type": "boolean",
 *   "description": "Debug messages will be included in the log.",
 *   "default": true,
 *   "groupCaption": "Options",
 *   "groupDescription": "Various options for this actor"
 * },
 * {
 *   "title": "Lightspeed",
 *   "type": "boolean",
 *   "description": "If checked then actors runs at the speed of light.",
 *   "default": true
 * }
 * ```
 */
export interface BooleanField<TVal extends boolean = boolean>
  extends BaseField,
    Omit<BaseFieldTypedProps<TVal>, 'prefill'> {
  type: 'boolean';
  /** Visual editor used for the input field. */
  editor?: BooleanEditorType;
  /**
   * If you want to group multiple checkboxes together,
   * add this option to the first of the group.
   */
  groupCaption?: string;
  /** Description displayed as help text displayed of group title. */
  groupDescription?: string;
}

/**
 * See https://docs.apify.com/platform/actors/development/input-schema#integer
 *
 * Example:
 *
 * ```json
 * {
 *   "title": "Memory",
 *   "type": "integer",
 *   "description": "Select memory in megabytes",
 *   "default": 64,
 *   "maximum": 1024,
 *   "unit": "MB"
 * }
 * ```
 */
export interface IntegerField<TVal extends number = number, TUnit extends string = string>
  extends BaseField,
    BaseFieldTypedProps<TVal> {
  type: 'integer';
  /** Visual editor used for the input field. */
  editor?: IntegerEditorType;
  /** Maximum allowed value. */
  maximum?: number;
  /** Minimum allowed value. */
  minimum?: number;
  /** Unit displayed next to the field in UI, for example second, MB, etc. */
  unit?: TUnit;
}

/**
 * See https://docs.apify.com/platform/actors/development/input-schema#object
 *
 * Example of proxy configuration:
 *
 * ```json
 * {
 *   "title": "Proxy configuration",
 *   "type": "object",
 *   "description": "Select proxies to be used by your crawler.",
 *   "prefill": { "useApifyProxy": true },
 *   "editor": "proxy"
 * }
 * ```
 *
 * Example of a blackbox object:
 *
 * ```json
 * {
 *   "title": "User object",
 *   "type": "object",
 *   "description": "Enter object representing user",
 *   "prefill": {
 *     "name": "John Doe",
 *     "email": "janedoe@gmail.com"
 *   },
 *   "editor": "json"
 * }
 * ```
 */
export interface ObjectField<TVal extends object = object>
  extends BaseField,
    BaseFieldTypedProps<TVal> {
  type: 'object';
  /** Visual editor used for the input field. */
  editor: ObjectEditorType;
  /** Regular expression that will be used to validate the keys of the object. */
  patternKey?: string;
  /** Regular expression that will be used to validate the values of object. */
  patternValue?: string;
  /** Maximum number of properties the object can have. */
  maxProperties?: number;
  /** Minimum number of properties the object can have. */
  minProperties?: number;
}

/**
 * See https://docs.apify.com/platform/actors/development/input-schema#array
 *
 * Usage of this field is based on the selected editor:
 * - `requestListSources` - value from this field can be used as input of RequestList class from Crawlee.
 * - `pseudoUrls` - is intended to be used with a combination of the PseudoUrl class and the enqueueLinks() function from Crawlee.
 *
 * Example of request list sources configuration:
 *
 * ```json
 * {
 *   "title": "Start URLs",
 *   "type": "array",
 *   "description": "URLs to start with",
 *   "prefill": [{ "url": "http://example.com" }],
 *   "editor": "requestListSources"
 * }
 * ```
 *
 * Example of an array:
 *
 * ```json
 * {
 *   "title": "Colors",
 *   "type": "array",
 *   "description": "Enter colors you know",
 *   "prefill": ["Red", "White"],
 *   "editor": "json"
 * }
 * ```
 */
export type ArrayField<TVal extends any[] = any[]> =
  | BaseArrayField<TVal>
  | KeyValueArrayField<TVal>
  | StringListArrayField<TVal>;

interface BaseArrayField<TVal extends any[] = any[]> extends BaseField, BaseFieldTypedProps<TVal> {
  type: 'array';
  /** Visual editor used for the input field. */
  editor: Exclude<ArrayEditorType, 'stringList' | 'keyValue'>;
  /** Maximum number of items the array can contain. */
  maxItems?: number;
  /** Minimum number of items the array can contain. */
  minItems?: number;
  /** Specifies whether the array should contain only unique values. */
  uniqueItems?: boolean;
}

interface KeyValueOrStringListArrayFieldProps {
  /**
   * Placeholder displayed in value field when no value is provided.
   * Works only with `keyValue` and `stringList` editors.
   */
  placeholderValue?: string;
  /**
   * Regular expression that will be used to validate the values
   * of items in the array. Works only with `keyValue` and `stringList` editors.
   */
  patternValue?: string;
}

interface StringListArrayField<TVal extends any[] = any[]>
  extends Omit<BaseArrayField<TVal>, 'editor'>,
    KeyValueOrStringListArrayFieldProps {
  editor: 'stringList';
}

interface KeyValueArrayField<TVal extends any[] = any[]>
  extends Omit<BaseArrayField<TVal>, 'editor'>,
    KeyValueOrStringListArrayFieldProps {
  editor: 'keyValue';
  /**
   * Placeholder displayed for key field when no value is specified.
   * Works only with `keyValue` editor.
   */
  placeholderKey?: string;
  /**
   * Regular expression that will be used to validate
   * the keys of items in the array.
   * Works only with `keyValue` editor.
   */
  patternKey?: string;
}

export const createActorInputSchema = <T extends ActorInputSchema<any>>(config: T) => config;
export const createStringField = <T extends string, TEnumTitles extends string = string>(field: StringField<T, TEnumTitles>) => field; // prettier-ignore
export const createBooleanField = <T extends boolean>(field: BooleanField<T>) => field; // prettier-ignore
export const createIntegerField = <T extends number, TUnit extends string>(field: IntegerField<T, TUnit>) => field; // prettier-ignore
export const createObjectField = <T extends object>(field: ObjectField<T>) => field; // prettier-ignore
export const createArrayField = <T extends any[]>(field: ArrayField<T>) => field; // prettier-ignore
