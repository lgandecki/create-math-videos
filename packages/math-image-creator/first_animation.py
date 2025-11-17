from manim import *

class FirstAnimation(Scene):
    def construct(self):
        # Create the title text
        title = Text("Manim: Your First Animation", font_size=48)
        
        # Animate text appearance
        self.play(Write(title))
        
        # Wait for 2 seconds to display the title
        self.wait(2)
        
        # Fade out the title
        self.play(FadeOut(title))