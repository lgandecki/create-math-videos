from manim import *

class NumberLineIntroduction(Scene):
    def construct(self):
        # Create the title text with different colors
        title_part1 = Text("The Number Line: ", font_size=48, color=WHITE)
        title_part2 = Text("A Visual Tool for Small Numbers", font_size=48, color=RED)
        
        # Group the text parts together
        title = VGroup(title_part1, title_part2).arrange(RIGHT, buff=0)
        title.move_to(ORIGIN)
        
        # Display the title with a fade-in animation
        self.play(FadeIn(title))
        
        # Wait for 3 seconds to let the viewer read
        self.wait(3)
        
        # Fade out the title
        self.play(FadeOut(title))