/// <reference path="../database-types.d.ts" />

migrate(
    (app) => {
        const collection = new Collection({
            name: 'diagnosticos',
            type: 'base',
            listRule: null,
            viewRule: null,
            createRule: '',
            updateRule: null,
            deleteRule: null,
            fields: [
                { name: 'nome', type: 'text', required: true, max: 120 },
                { name: 'email', type: 'email', required: true },
                { name: 'instagram', type: 'text', required: true, max: 120 },
                { name: 'mensagem', type: 'text', required: false, max: 2000 },
                { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            ],
        });

        app.save(collection);
    },
    (app) => {
        const collection = app.findCollectionByNameOrId('diagnosticos');

        app.delete(collection);
    },
);
