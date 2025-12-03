import { INestApplication, Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

interface CustomSwaggerOptions {
    nodeEnv?: string
    title: string
    description: string
    version: string
}

export class CustomSwaggerModule {
    private isBuilt = false

    build(
        app: INestApplication,
        { nodeEnv, title, description, version }: CustomSwaggerOptions,
    ) {
        if (!nodeEnv || nodeEnv.startsWith('prod')) {
            return
        }

        const options = new DocumentBuilder()
            .setTitle(title)
            .setDescription(description)
            .setVersion(version)
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

    log(logger: Logger, apiUrl: string) {
        if (this.isBuilt) {
            logger.log(`📖 Documentation: \x1b[36m${apiUrl}/docs\x1b[0m`)
        }
    }
}
