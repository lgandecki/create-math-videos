from manim import *

class FirstMathAnimation(Scene):
    def construct(self):
        # Create title text
        title = Text("Manim: Your First Math Animation", font_size=48)
        title.to_edge(UP)
        
        # Create subtitle text
        subtitle = Text("Unlock the power of visual mathematics!", font_size=36)
        subtitle.shift(DOWN * 0.5)
        
        # Display the title
        self.play(Write(title))
        self.wait(1)
        
        # Add the subtitle
        self.play(Write(subtitle))
        self.wait(2)
        
        # Fade out both texts
        self.play(FadeOut(title), FadeOut(subtitle))
        self.wait(1)