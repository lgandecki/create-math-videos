from manim import *

class HelloWorldMath(Scene):
    def construct(self):
        # Create the title
        title = Text("The 'Hello World' of Math", font_size=48)
        title.to_edge(UP, buff=1.5)
        
        # Create the subtitle
        subtitle = Text("Displaying Numbers & Variables", font_size=36)
        subtitle.next_to(title, DOWN, buff=1)
        
        # Animate the title appearing
        self.play(Write(title))
        self.wait(1)
        
        # Animate the subtitle appearing
        self.play(Write(subtitle))
        self.wait(2)
        
        # Keep both on screen for a moment
        self.wait(2)