from manim import *

class PlottingPoints(Scene):
    def construct(self):
        # Create the number line
        number_line = NumberLine(
            x_range=[-6, 6, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=36
        )
        
        # Position the number line
        number_line.move_to(ORIGIN)
        
        # Title
        title = Text("Plotting Points on a Number Line", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        # Display the number line clearly
        self.play(Write(title))
        self.wait(1)
        self.play(Create(number_line))
        self.wait(2)
        
        # Introduce the concept
        intro_text = Text("Let's learn how to plot points on the number line", font_size=32)
        intro_text.next_to(number_line, DOWN, buff=1)
        self.play(Write(intro_text))
        self.wait(2)
        self.play(FadeOut(intro_text))
        
        # Plot point at +4
        point_4 = Dot(number_line.number_to_point(4), color=RED, radius=0.1)
        label_4 = Text("+4", font_size=32, color=RED)
        label_4.next_to(point_4, UP, buff=0.3)
        
        # Animate point +4 appearing
        self.play(FadeIn(point_4), Write(label_4))
        self.wait(1)
        
        # Explain position of +4
        explanation_4 = Text("Point +4 is 4 units to the RIGHT of 0", font_size=28)
        explanation_4.next_to(number_line, DOWN, buff=1)
        self.play(Write(explanation_4))
        self.wait(2)
        self.play(FadeOut(explanation_4))
        
        # Plot point at -2
        point_neg2 = Dot(number_line.number_to_point(-2), color=GREEN, radius=0.1)
        label_neg2 = Text("-2", font_size=32, color=GREEN)
        label_neg2.next_to(point_neg2, UP, buff=0.3)
        
        # Animate point -2 appearing
        self.play(FadeIn(point_neg2), Write(label_neg2))
        self.wait(1)
        
        # Explain position of -2
        explanation_neg2 = Text("Point -2 is 2 units to the LEFT of 0", font_size=28)
        explanation_neg2.next_to(number_line, DOWN, buff=1)
        self.play(Write(explanation_neg2))
        self.wait(2)
        self.play(FadeOut(explanation_neg2))
        
        # Show both points together
        both_points_text = Text("We now have two points plotted on our number line", font_size=28)
        both_points_text.next_to(number_line, DOWN, buff=1)
        self.play(Write(both_points_text))
        self.wait(2)
        self.play(FadeOut(both_points_text))
        
        # Remove the points
        removal_text = Text("Let's remove the points", font_size=28)
        removal_text.next_to(number_line, DOWN, buff=1)
        self.play(Write(removal_text))
        self.wait(1)
        
        self.play(FadeOut(point_4), FadeOut(label_4), FadeOut(point_neg2), FadeOut(label_neg2))
        self.wait(1)
        self.play(FadeOut(removal_text))
        
        # Final message
        final_text = Text("That's how we plot points on a number line!", font_size=32, color=BLUE)
        final_text.next_to(number_line, DOWN, buff=1)
        self.play(Write(final_text))
        self.wait(3)