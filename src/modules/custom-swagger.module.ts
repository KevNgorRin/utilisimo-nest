import { INestApplication, Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

interface CustomSwaggerOptions {
    nodeEnv?: string
    title?: string
    description?: string
    version?: string
    apiUrl?: string
}

export class CustomSwaggerModule {
    private isBuilt = false
    private nodeEnv?: string
    private title?: string
    private description?: string
    private version?: string
    private apiUrl?: string

    constructor({
        nodeEnv,
        title,
        description,
        version,
        apiUrl,
    }: CustomSwaggerOptions) {
        this.nodeEnv = nodeEnv
        this.title = title
        this.description = description
        this.version = version
        this.apiUrl = apiUrl
    }

    build(app: INestApplication) {
        if (!this.nodeEnv || this.nodeEnv.startsWith('prod')) {
            return
        }

        const options = new DocumentBuilder()
            .setTitle(this.title || 'API Documentation')
            .setDescription(this.description || 'Here goes the API description')
            .setVersion(this.version || '1.0')
            .addBearerAuth()
            .build()
        const document = SwaggerModule.createDocument(app, options)

        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                tagsSorter: 'alpha',
                operationsSorter: (a, b) => {
                    const methodOrder = { GET: 0, POST: 1, PATCH: 2, DELETE: 3 }
                    const methodA = methodOrder[a.get('method').toUpperCase()]
                    const methodB = methodOrder[b.get('method').toUpperCase()]

                    if (methodA !== undefined && methodB !== undefined) {
                        return methodA - methodB
                    }

                    const concatA = a.get('method') + a.get('path')
                    const concatB = b.get('method') + b.get('path')

                    if (concatA === concatB) {
                        return 0
                    }

                    return concatA < concatB ? -1 : 1
                },
            },
        })

        this.isBuilt = true
    }

    log(logger: Logger) {
        if (this.isBuilt && this.apiUrl) {
            logger.log(`📖 Documentation: \x1b[36m${this.apiUrl}/docs\x1b[0m`)
        }
    }
}
