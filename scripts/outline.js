//Code Referenced from :https://phaser.discourse.group/t/sprite-outline-via-shader-showcase-looking-for-improvements/2375
//This will allow the sprite to have a outline around the characters to know which character is selected
var OutlinePipeline = new Phaser.Class({
    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
    initialize:
    function OutlinePipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: `
            precision mediump float;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;
            void main(void) {
                vec4 color = texture2D(uMainSampler, outTexCoord);
                vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - 0.001));
                vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + 0.001));
                vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + 0.001, outTexCoord.y));
                vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - 0.001, outTexCoord.y));
                
                gl_FragColor = color;
                
                if (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)  ) {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, .2);
                }
            }
            `
        });
    } 
});