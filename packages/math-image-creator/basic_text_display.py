from manim import *

class BasicTextDisplay(Scene):
    def construct(self):
        # Start with a blank screen
        self.wait(1)
        
        # Create the text "Hello Math!"
        hello_text = Text("Hello Math!", font_size=48)
        
        # Animate the text fading/writing onto the center of the screen
        self.play(Write(hello_text))
        self.wait(2)
        
        # Show explanation text about basic text objects
        explanation = Text(
            "This demonstrates how to create\nand display basic text objects in Manim",
            font_size=24
        ).shift(DOWN * 2)
        
        self.play(FadeIn(explanation))
        self.wait(3)
        
        # Highlight the simplicity
        simplicity_text = Text(
            "Simple way to put information\ndirectly onto the visual canvas",
            font_size=24,
            color=BLUE
        ).shift(DOWN * 3.5)
        
        self.play(FadeIn(simplicity_text))
        self.wait(3)
        
        # Final pause before ending
        self.wait(1)