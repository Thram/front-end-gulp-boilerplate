<container>
    <div id="main" class="{ class_name }">
    </div>

    <script>
        var self = this;
        var riot = require('riot');
        var router = require('router');
        var lang = require('lang');

        router.on('render', function (routeInfo) {
            riot.mount(self.root, 'view-' + routeInfo.view, routeInfo.params);
        });

    </script>

    <style scoped>
        :scope {
            position: absolute;
            display: block;
            font-family: sans-serif;
            margin-right: 0;
            margin-bottom: 130px;
            margin-left: 50px;
            padding: 1em;
            text-align: center;
            color: #666;
        }

        ul {
            padding: 10px;
            list-style: none;
        }

        li {
            display: inline-block;
            margin: 5px;
        }

        a {
            display: block;
            background: #f7f7f7;
            text-decoration: none;
            width: 150px;
            height: 150px;
            line-height: 150px;
            color: inherit;
        }

        a:hover {
            background: #eee;
            color: #000;
        }

        @media (min-width: 480px) {
            :scope {
                margin-right: 200px;
                margin-bottom: 0;
            }
        }
    </style>

</container>
