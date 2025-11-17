from manim import *

class MathHelloWorld(Scene):
    def construct(self):
        # Create the title text
        title = Text("The Math 'welcome'", font_size=48)
        title.set_color(BLUE)
        
        # Position the title at the center
        title.move_to(ORIGIN)
        
        # Animate the title appearing
        self.play(Write(title))
        
        # Hold the title on screen for 2 seconds
        self.wait(2)