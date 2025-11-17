from manim import *

class DivisibilityBy3Conclusion(Scene):
    def construct(self):
        # Title
        title = Text("To check if a number is divisible by 3:", font_size=48, color=BLUE)
        title.to_edge(UP, buff=1)
        
        # Rule steps
        step1 = Text("1. Sum its digits.", font_size=40, color=WHITE)
        step2 = Text("2. If the sum is divisible by 3, the original number is too!", font_size=40, color=WHITE)
        
        # Position steps
        step1.next_to(title, DOWN, buff=1)
        step2.next_to(step1, DOWN, buff=0.8)
        
        # Final message
        final_message = Text("A simple trick for quick checks!", font_size=44, color=GREEN)
        final_message.to_edge(DOWN, buff=1.5)
        
        # Animations
        self.play(Write(title))
        self.wait(1)
        
        self.play(FadeIn(step1))
        self.wait(1.5)
        
        self.play(FadeIn(step2))
        self.wait(2)
        
        self.play(Write(final_message))
        self.wait(2)
        
        # Highlight the entire rule
        rule_box = SurroundingRectangle(
            VGroup(title, step1, step2), 
            color=YELLOW, 
            buff=0.5,
            corner_radius=0.2
        )
        
        self.play(Create(rule_box))
        self.wait(3)