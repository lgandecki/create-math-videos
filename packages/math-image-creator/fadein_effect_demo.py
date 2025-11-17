from manim import *

class FadeInEffectDemo(Scene):
    def construct(self):
        # Start with a blank screen
        
        # Create code block on the left side
        code_lines = [
            'text = Text("Hello World!")',
            'self.play(FadeIn(text))'
        ]
        
        code_block = VGroup()
        for i, line in enumerate(code_lines):
            code_line = Text(line, font="monospace", font_size=24, color=WHITE)
            code_line.move_to(UP * (1.5 - i * 0.5))
            code_block.add(code_line)
        
        # Add code block to screen
        self.add(code_block)
        
        # Wait a moment
        self.wait(1)
        
        # Create the "Hello World!" text that will fade in
        hello_text = Text("Hello World!", font_size=48, color=BLUE)
        hello_text.move_to(ORIGIN)
        
        # Animate the FadeIn effect
        self.play(FadeIn(hello_text))
        
        # Wait to see the result
        self.wait(2)
        
        # Add description at the bottom
        description = Text("FadeIn: Makes objects appear smoothly.", font_size=28, color=YELLOW)
        description.to_edge(DOWN)
        
        # Fade in the description as well
        self.play(FadeIn(description))
        
        # Final wait
        self.wait(2)