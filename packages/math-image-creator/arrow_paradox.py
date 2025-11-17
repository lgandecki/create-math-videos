from manim import *

class ArrowParadox(Scene):
    def construct(self):
        # Title
        title = Text("The Arrow Paradox", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create arrow - using a combination of shapes to make it look like an arrow
        arrow_body = Rectangle(width=1.5, height=0.2, color=YELLOW, fill_opacity=1)
        arrow_head = Triangle(color=YELLOW, fill_opacity=1).scale(0.3).rotate(PI/2)
        arrow_head.next_to(arrow_body, RIGHT, buff=0)
        arrow = VGroup(arrow_body, arrow_head)
        arrow.move_to(LEFT * 5)
        
        # Display arrow flying horizontally across the screen
        self.play(Create(arrow))
        self.wait(0.5)
        
        # Animate arrow flying
        self.play(arrow.animate.shift(RIGHT * 4), run_time=3)
        
        # Pause the arrow at a specific point
        pause_position = arrow.get_center()
        
        # Text: "Consider an arrow in flight. At any single *instant* in time..."
        text1 = Text("Consider an arrow in flight. At any single instant in time...", 
                    font_size=24, color=WHITE)
        text1.to_edge(DOWN, buff=1)
        self.play(Write(text1))
        self.wait(2)
        
        # Circle a tiny segment of the arrow
        highlight_circle = Circle(radius=0.3, color=RED, stroke_width=3)
        highlight_circle.move_to(arrow.get_center())
        self.play(Create(highlight_circle))
        self.wait(1)
        
        # Clear previous text and show new text
        self.play(FadeOut(text1))
        text2 = Text("...it occupies a specific point in space.", 
                    font_size=24, color=WHITE)
        text2.to_edge(DOWN, buff=1)
        self.play(Write(text2))
        self.wait(2)
        
        # Show the arrow perfectly still for that instant
        still_emphasis = Text("MOTIONLESS", font_size=20, color=RED)
        still_emphasis.next_to(arrow, UP, buff=0.5)
        self.play(Write(still_emphasis))
        self.wait(1)
        
        # Clear text and show next message
        self.play(FadeOut(text2))
        text3 = Text("If it occupies a specific point, it is not moving at that instant.", 
                    font_size=24, color=WHITE)
        text3.to_edge(DOWN, buff=1)
        self.play(Write(text3))
        self.wait(2)
        
        # Remove the emphasis and circle
        self.play(FadeOut(still_emphasis), FadeOut(highlight_circle))
        
        # Unpause arrow and move it to another position
        self.play(arrow.animate.shift(RIGHT * 2), run_time=2)
        
        # Pause again and repeat the static state
        highlight_circle2 = Circle(radius=0.3, color=RED, stroke_width=3)
        highlight_circle2.move_to(arrow.get_center())
        still_emphasis2 = Text("MOTIONLESS", font_size=20, color=RED)
        still_emphasis2.next_to(arrow, UP, buff=0.5)
        
        self.play(Create(highlight_circle2), Write(still_emphasis2))
        self.wait(1)
        
        # Clear previous text and show the paradox question
        self.play(FadeOut(text3))
        text4 = Text("Since time is composed of a series of such instants,\nand at each instant the arrow is motionless,\nhow can the arrow ever move?", 
                    font_size=22, color=YELLOW)
        text4.to_edge(DOWN, buff=0.5)
        self.play(Write(text4))
        self.wait(3)
        
        # Remove visual elements
        self.play(FadeOut(highlight_circle2), FadeOut(still_emphasis2))
        
        # Show explanation
        self.play(FadeOut(text4))
        explanation = Text("The paradox treats time as a series of static points\nrather than a continuous flow.\nMotion is a change in position over time,\nnot at a single, isolated instant.", 
                          font_size=20, color=GREEN)
        explanation.to_edge(DOWN, buff=0.5)
        self.play(Write(explanation))
        self.wait(3)
        
        # Demonstrate continuous motion
        continuous_text = Text("Motion is continuous:", font_size=24, color=BLUE)
        continuous_text.next_to(explanation, UP, buff=1)
        self.play(Write(continuous_text))
        
        # Show smooth continuous motion of the arrow
        self.play(arrow.animate.shift(RIGHT * 3), run_time=2, rate_func=smooth)
        
        self.wait(2)
        
        # Final fade out
        self.play(FadeOut(arrow), FadeOut(explanation), FadeOut(continuous_text), FadeOut(title))
        self.wait(1)