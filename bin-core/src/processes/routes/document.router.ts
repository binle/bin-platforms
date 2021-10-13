import path from 'path';
import {
  ApiRequestData,
  ApiResponseData,
  ApiResponseDataFailed,
  ApiResponseDataSuccess,
  Express,
  ExRequest,
  ExResponse,
  IArraySchema,
  IEnumSchema,
  IObjectSchema,
  ISchemaCore,
  MethodPathApi,
  TypeConstructor,
  IValidationCore,
} from 'src/definitions';
import { defineMapKeyPropertyTypeDecoratorFromType } from './../api';
import { omit } from 'lodash';

type DefinitionType = {
  docPath: string;
  count: number;
  definitionHTMLs: { html: string; index: number }[];
  definitionHash: any;
};

export class DocumentRouter {
  private static htmlTitle = 'API document';
  private static htmlHeader = `<head>
    <title>${DocumentRouter.htmlTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      .validation {
        font-style: italic;
        font-weight: 600;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.05);
      }
      .red-highlight {
        color: #dd2719;
      }
      .request-are {
        border-radius: 10px;
        border: none;
        color: black;
        margin-bottom: 10px;
        background-color: #ddd;
      }
  
      .request-are-get {
        background-color: rgba(97, 175, 254, 0.1);
      }
  
      .request-are-post {
        background-color: rgba(73, 204, 144, 0.1);
      }
  
      .request-are-put {
        background-color: rgba(252, 161, 48, 0.1);
      }
  
      .request-are-delete {
        background-color: rgba(249, 62, 62, 0.1);
      }
  
      .request-collapsible {
        background-color: transparent;
        cursor: pointer;
        padding: 10px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid white;
        background-color: #aaa;
        border-radius: 5px;
      }
  
      .request-collapsible-get {
        background-color: rgba(97, 175, 255, 0.5);
      }
  
      .request-collapsible-post {
        background-color: rgba(73, 204, 145, 0.5);
      }
  
      .request-collapsible-put {
        background-color: rgba(252, 161, 48, 0.5);
      }
  
      .request-collapsible-delete {
        background-color: rgb(249, 62, 62, 0.5);
      }
  
      .content {
        padding: 5px 20px;
        display: none;
        overflow: hidden;
        background-color: transparent;
      }
  
      .request-method-path {
        font-weight: 600;
      }
  
      .request-method {
        border: none;
        height: 20px;
        min-width: 100px;
        border-radius: 4px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 10px;
        background-color: #555;
      }

      .request-method-definition{ 
        justify-content: start;
        padding: 0 0 0 20px;
      }
  
      .request-method-get {
        background-color: #61afff;
      }
  
      .request-method-post {
        background-color: #49cc91;
      }
  
      .request-method-put {
        background-color: #fca131;
      }
  
      .request-method-delete {
        background-color: #f93e3d;
      }
  
      .request-content {
        display: flex;
        flex-direction: column;
      }
      .request-description {
        flex: 1;
      }
      .request-label {
        font-weight: 800;
        flex: 1;
        margin-bottom: 10px;
      }
      .request-data {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 5px;
        flex: 1;
        border-top: 1px solid;
      }
      /* ================================== */
      .request-data-info {
        font-weight: 500;
        flex: 1;
      }
  
      .request-data-property {
        flex: 1;
        padding: 0px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }
  
      .request-data-property-name {
        width: 200px;
      }
  
      .request-data-property-detail {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
  
      /* ================================== */
      .response-content {
        display: flex;
        flex-direction: column;
      }
  
      .response-label {
        font-weight: 800;
        width: 100%;
        margin-top: 20px;
      }
  
      .response-data {
        display: flex;
        flex-direction: column;
        padding: 5px 0;
        width: 100%;
      }
  
      .response-data-label {
        width: 100%;
      }
  
      /* ================================== */
      .pl20 {
        padding-left: 20px;
      }
    </style>
  </head>`;

  private static htmlScript = `
    <script>

      function expandSelectedHash(hashId) {
        hashId = hashId || location.hash.substring(1);
        var currentElement = document.getElementById(hashId);
        if (currentElement) {
          var content = currentElement.nextElementSibling;
          content.style.display = 'block';
          currentElement.scrollIntoView();
        }
      }

      expandSelectedHash();
      var coll = document.getElementsByClassName('request-collapsible');
      var i;

      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function () {
          var tempIndex = location.href.indexOf('/#');
          var newHash = '#'+ this.id;
          var newUrl;
          if (tempIndex > 0) {
            var currentHash = location.href.substring(tempIndex);
            newUrl = location.href.replace(currentHash, '/' + newHash) ;
          } else {
            var hashFlag = location.href.endsWith('/') ? '' : '/';
            newUrl = location.href + hashFlag + newHash;
          }
          
          location.href = newUrl;

          // window.history.pushState(null, 'htmlTitle', newUrl);
          this.classList.toggle('active');
          var content = this.nextElementSibling;
          if (content.style.display === 'block') {
            content.style.display = 'none';
          } else if (this.id){
            expandSelectedHash(this.id);
          }
          else {
            content.style.display = 'block';
          }
        });
      }
    </script>
  `;

  private static generateSchemaHTML(
    definition: DefinitionType,
    propertyName: string,
    schema?: ISchemaCore,
    isObjectFromArray?: boolean
  ): string {
    let propertyDetailContent = '';
    let validationContent = '';
    const validation = omit(schema?.validation || {}, ['isRequired']);
    if (Object.keys(validation).length) {
      validationContent += `<span class="validation">${JSON.stringify(validation)}</span>`;
    }
    switch (schema?.type) {
      case 'boolean':
      case 'string':
      case 'number':
      case 'integer':
      case 'date':
      case 'file': {
        propertyDetailContent += `<span>${schema.type}${
          schema.description ? `- ${schema.description}` : ''
        } </span>`;
        propertyDetailContent += validationContent;
        break;
      }
      case 'enum': {
        const enumName = (schema as IEnumSchema).enumName;
        const enumValues = (schema as IEnumSchema).enumValues;
        propertyDetailContent += `
                <span>${schema.type}${schema.description ? `- ${schema.description}` : ''} </span>
                <span>
                  ${enumName && `${enumName} : `}[${enumValues.join(', ')}]
                </span>`;
        propertyDetailContent += validationContent;
        break;
      }
      case 'array': {
        let arrayCount = '[]';
        let itemSchema: ISchemaCore | undefined = (schema as IArraySchema).itemSchema;
        let leafItemSchema: ISchemaCore | undefined;
        while (itemSchema?.type === 'array') {
          arrayCount += '[]';
          leafItemSchema = itemSchema;
          itemSchema = (itemSchema as IArraySchema).itemSchema;
        }
        leafItemSchema = itemSchema || leafItemSchema;
        const objectName = leafItemSchema?.propertyType?.name || 'Object';
        propertyDetailContent += `
              <span>
                array - ${arrayCount}${objectName}${
          schema.description ? `- ${schema.description}` : ''
        }
              </span>
              ${validationContent}
              ${DocumentRouter.generateSchemaHTML(definition, `${objectName} :`, itemSchema, true)}
        `;
        break;
      }
      case 'object': {
        const properties = (schema as IObjectSchema).properties;
        if (schema.propertyType && schema.propertyType.name !== 'Object') {
          const hashId = DocumentRouter.generateDefinition(definition, schema);
          propertyDetailContent += `
          <span>
            <a href="${definition.docPath}/#${hashId}" onclick="expandSelectedHash('${hashId}')">
              ${hashId}
            </a>
            ${schema.description ? `- ${schema.description}` : ''}
          </span>
          ${validationContent}
          `;
        } else {
          if (!isObjectFromArray) {
            const descriptionContent = `<span>${'Object'}${
              schema.description ? `- ${schema.description}` : ''
            }</span>`;

            const objectStartContent = properties
              ? `<div class="request-data pl20">
            <div class="request-data-property">
              <div class="request-data-property-detail">`
              : '';

            propertyDetailContent += `${descriptionContent}${validationContent}${objectStartContent}`;
          }
          if (properties) {
            for (const key in properties) {
              propertyDetailContent += DocumentRouter.generateSchemaHTML(
                definition,
                key,
                properties[key]
              );
            }
          }
          if (!isObjectFromArray) {
            propertyDetailContent += properties
              ? `</div>
            </div>
          </div>`
              : '';
          }
        }

        break;
      }
    }

    const redHighlight = schema?.validation?.isRequired ? 'red-highlight' : '';

    return `
      <div class="request-data pl20">
        <div class="request-data-property">
          <span class="request-data-property-name ${redHighlight}">${propertyName}</span>
          <div class="request-data-property-detail">
            ${propertyDetailContent}
          </div>
        </div>
      </div>`;
  }

  private static generateApiContent(
    method: string,
    apiPath: string,
    data: {
      description?: string;
      request: ApiRequestData;
      response: ApiResponseData;
    },
    definition: DefinitionType
  ): string {
    let apiContent = `<div class="request-are request-are-${method.toLowerCase()}">
      <button id="${method}_${apiPath}"
        type="button" class="request-collapsible request-collapsible-${method.toLowerCase()}"
      >
        <div class="request-method request-method-${method.toLowerCase()}">${method.toUpperCase()}</div>
        <div class="request-method-path">${apiPath}</div>
      </button>
      <div class="content">
      <div class="request-description">
        ${data.description ? `Description: ${data.description}` : ''}
      </div>
    `;

    // generate request
    apiContent += `
        <div class="request-content">
          <div class="request-label">Request :</div>`;
    for (const fromKey in data.request) {
      if (fromKey !== 'request' && fromKey != 'response') {
        apiContent += DocumentRouter.generateSchemaHTML(definition, fromKey, data.request[fromKey]);
      }
    }

    apiContent += `
        </div>`;

    // generate response
    const successSchema: IObjectSchema<ApiResponseDataSuccess> = {
      type: 'object',
      description: data.response.success?.description || 'Response in success case:',
      properties: {
        data: data.response.success?.data || ({ type: undefined } as ISchemaCore),
      },
    };

    const getFailedDetailSchema = (failedData: ApiResponseDataFailed): IObjectSchema => ({
      type: 'object',
      description:
        failedData.description || `Request failed with status ${failedData.error?.status}`,
      properties: {
        error: {
          type: 'object',
          description: JSON.stringify({
            status: failedData.error?.status,
            message: failedData.error?.message,
            code: failedData.error?.code,
          }),
        } as IObjectSchema,
      },
    });

    apiContent += `
        <div class="response-content">
          <div class="response-label">Response</div>
          ${DocumentRouter.generateSchemaHTML(definition, 'Success', successSchema)}
          `;
    for (const key in data.response.failed || {}) {
      const failedData = (data.response.failed || {})[key];
      if (failedData) {
        apiContent += `
          ${DocumentRouter.generateSchemaHTML(
            definition,
            `Failed - ${key}`,
            getFailedDetailSchema(failedData)
          )}
          `;
      }
    }
    apiContent += `
        </div>`;

    apiContent += `
      </div>
    </div>`;
    return apiContent;
  }

  private static generateDefinition(definition: DefinitionType, schema: IObjectSchema): string {
    const constructorKey = defineMapKeyPropertyTypeDecoratorFromType(
      schema.propertyType as TypeConstructor
    );
    if (definition.definitionHash[constructorKey]) {
      return definition.definitionHash[constructorKey];
    }
    const index = definition.count + 1;
    definition.count = index;

    const hashId = `${index}-${schema.propertyType?.name}`;
    definition.definitionHash[constructorKey] = hashId;

    let definitionHTMLContent = `
    <div class="request-are">
      <button id="${hashId}"
        type="button" class="request-collapsible"
      >
        <div class="request-method request-method-definition">
          ${index}-${schema.propertyType?.name}
        </div>
      </button>
      <div class="content">
    `;
    definitionHTMLContent += `
        <div class="request-content">`;
    if (schema.properties) {
      for (const key in schema.properties) {
        if (key && schema.properties[key]) {
          definitionHTMLContent += DocumentRouter.generateSchemaHTML(
            definition,
            key,
            schema.properties[key]
          );
        }
      }
    }
    definitionHTMLContent += `
        </div>`;

    definitionHTMLContent += `
      </div>
    </div>`;
    definition.definitionHTMLs.push({ index, html: definitionHTMLContent });

    return hashId;
  }

  static getHTMLContent(data: MethodPathApi, docPath: string): string {
    const definition: DefinitionType = {
      docPath,
      count: 0,
      definitionHTMLs: [],
      definitionHash: {},
    };
    let apiContents = '';
    for (const apiPath in data) {
      for (const method in data[apiPath]) {
        apiContents += DocumentRouter.generateApiContent(
          method,
          apiPath,
          data[apiPath][method],
          definition
        );
      }
    }
    definition.definitionHTMLs.sort((a, b) => a.index - b.index);
    return `<!DOCTYPE html>
    <html>
      ${DocumentRouter.htmlHeader}
      <body>
        <h1>APIs: </h1>
        ${apiContents}

        <h1>Definitions: </h1>
        ${definition.definitionHTMLs.map((item) => item.html).join('')}
        ${DocumentRouter.htmlScript}
      </body>
    </html>`;
  }

  static routeDocumentAPI(app: Express, docPath: string, data: MethodPathApi): void {
    const docApiPath = path.join('/', docPath);
    const content = DocumentRouter.getHTMLContent(data, docApiPath);
    app.get(docApiPath, (_req: ExRequest, res: ExResponse) => {
      res.status(200).send(content);
    });
  }
}
