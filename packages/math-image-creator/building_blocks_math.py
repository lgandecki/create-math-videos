from manim import *

class BuildingBlocksMath(Scene):
    def construct(self):
        # Create the variable x
        x_var = Text("x", font_size=72)
        
        # Show x appearing
        self.play(Write(x_var))
        self.wait(1)
        
        # Transform x into 3 + 4
        three = Text("3", font_size=72)
        plus = Text("+", font_size=72)
        four = Text("4", font_size=72)
        
        # Position the expression components
        expression = VGroup(three, plus, four).arrange(RIGHT, buff=0.3)
        
        self.play(Transform(x_var, expression))
        self.wait(1)
        
        # Create equals and 7
        equals = Text("=", font_size=72)
        seven = Text("7", font_size=72)
        equals_seven = VGroup(equals, seven).arrange(RIGHT, buff=0.3)
        equals_seven.next_to(expression, RIGHT, buff=0.3)
        
        # Animate = 7 appearing
        self.play(Write(equals_seven))
        self.wait(1)
        
        # Group the full equation for highlighting
        full_equation = VGroup(expression, equals_seven)
        
        # Highlight each component
        # Create colored boxes for highlighting
        highlight_color = YELLOW
        
        # Highlight 3
        three_highlight = SurroundingRectangle(three, color=highlight_color, buff=0.1)
        self.play(Create(three_highlight))
        self.wait(0.8)
        self.play(FadeOut(three_highlight))
        
        # Highlight 4
        four_highlight = SurroundingRectangle(four, color=highlight_color, buff=0.1)
        self.play(Create(four_highlight))
        self.wait(0.8)
        self.play(FadeOut(four_highlight))
        
        # Highlight + sign
        plus_highlight = SurroundingRectangle(plus, color=highlight_color, buff=0.1)
        self.play(Create(plus_highlight))
        self.wait(0.8)
        self.play(FadeOut(plus_highlight))
        
        # Highlight = sign
        equals_highlight = SurroundingRectangle(equals, color=highlight_color, buff=0.1)
        self.play(Create(equals_highlight))
        self.wait(0.8)
        self.play(FadeOut(equals_highlight))
        
        # Highlight 7
        seven_highlight = SurroundingRectangle(seven, color=highlight_color, buff=0.1)
        self.play(Create(seven_highlight))
        self.wait(0.8)
        self.play(FadeOut(seven_highlight))
        
        # Final pause
        self.wait(2)