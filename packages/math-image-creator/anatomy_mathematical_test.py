from manim import *

class AnatomyMathematicalTest(Scene):
    def construct(self):
        # Display the heading
        title = Text("What Makes a Test?", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create the main components as blocks
        components_title = Text("Components of a Mathematical Test:", font_size=32, color=WHITE)
        components_title.next_to(title, DOWN, buff=1.5)
        self.play(Write(components_title))
        self.wait(0.5)
        
        # Create three component blocks
        conditions_rect = Rectangle(width=3, height=1.5, color=GREEN, fill_opacity=0.2)
        procedure_rect = Rectangle(width=3, height=1.5, color=YELLOW, fill_opacity=0.2)
        outcome_rect = Rectangle(width=3, height=1.5, color=RED, fill_opacity=0.2)
        
        # Position blocks horizontally with more spacing
        conditions_rect.move_to(LEFT * 4 + DOWN * 1)
        procedure_rect.move_to(ORIGIN + DOWN * 1)
        outcome_rect.move_to(RIGHT * 4 + DOWN * 1)
        
        # Create labels for each block
        conditions_label = Text("Conditions", font_size=24, color=GREEN, weight=BOLD)
        conditions_label.next_to(conditions_rect, UP, buff=0.2)
        conditions_desc = Text("Prerequisites\nor criteria", font_size=18, color=WHITE)
        conditions_desc.move_to(conditions_rect.get_center())
        
        procedure_label = Text("Procedure", font_size=24, color=YELLOW, weight=BOLD)
        procedure_label.next_to(procedure_rect, UP, buff=0.2)
        procedure_desc = Text("Step-by-step\ninstructions", font_size=18, color=WHITE)
        procedure_desc.move_to(procedure_rect.get_center())
        
        outcome_label = Text("Outcome", font_size=24, color=RED, weight=BOLD)
        outcome_label.next_to(outcome_rect, UP, buff=0.2)
        outcome_desc = Text("Conclusion\nreached", font_size=18, color=WHITE)
        outcome_desc.move_to(outcome_rect.get_center())
        
        # Animate the blocks appearing
        self.play(
            DrawBorderThenFill(conditions_rect),
            Write(conditions_label),
            Write(conditions_desc)
        )
        self.wait(0.5)
        
        self.play(
            DrawBorderThenFill(procedure_rect),
            Write(procedure_label),
            Write(procedure_desc)
        )
        self.wait(0.5)
        
        self.play(
            DrawBorderThenFill(outcome_rect),
            Write(outcome_label),
            Write(outcome_desc)
        )
        self.wait(1)
        
        # Fade out the general components
        self.play(
            FadeOut(components_title),
            FadeOut(conditions_rect), FadeOut(conditions_label), FadeOut(conditions_desc),
            FadeOut(procedure_rect), FadeOut(procedure_label), FadeOut(procedure_desc),
            FadeOut(outcome_rect), FadeOut(outcome_label), FadeOut(outcome_desc)
        )
        
        # Example: The Even Number Test
        example_title = Text("Example: The Even Number Test", font_size=32, color=BLUE)
        example_title.next_to(title, DOWN, buff=1.5)
        self.play(Write(example_title))
        self.wait(1)
        
        # Create example blocks
        example_conditions_rect = Rectangle(width=5, height=1.8, color=GREEN, fill_opacity=0.2)
        example_procedure_rect = Rectangle(width=5, height=1.8, color=YELLOW, fill_opacity=0.2)
        example_outcome_rect = Rectangle(width=5, height=1.8, color=RED, fill_opacity=0.2)
        
        # Position blocks vertically for the example with better spacing
        example_conditions_rect.move_to(UP * 0.5)
        example_procedure_rect.move_to(DOWN * 1.5)
        example_outcome_rect.move_to(DOWN * 3.5)
        
        # Create example labels
        example_conditions_label = Text("Condition:", font_size=20, color=GREEN, weight=BOLD)
        example_conditions_label.next_to(example_conditions_rect, UP, buff=0.1)
        example_conditions_text = Text("The number is an integer", font_size=18, color=WHITE)
        example_conditions_text.move_to(example_conditions_rect.get_center())
        
        example_procedure_label = Text("Procedure:", font_size=20, color=YELLOW, weight=BOLD)
        example_procedure_label.next_to(example_procedure_rect, UP, buff=0.1)
        example_procedure_text = Text("Divide the number by 2", font_size=18, color=WHITE)
        example_procedure_text.move_to(example_procedure_rect.get_center())
        
        example_outcome_label = Text("Outcome:", font_size=20, color=RED, weight=BOLD)
        example_outcome_label.next_to(example_outcome_rect, UP, buff=0.1)
        example_outcome_text = Text("If remainder is 0: even\nOtherwise: odd", font_size=18, color=WHITE)
        example_outcome_text.move_to(example_outcome_rect.get_center())
        
        # Animate example blocks
        self.play(
            DrawBorderThenFill(example_conditions_rect),
            Write(example_conditions_label),
            Write(example_conditions_text)
        )
        self.wait(1)
        
        self.play(
            DrawBorderThenFill(example_procedure_rect),
            Write(example_procedure_label),
            Write(example_procedure_text)
        )
        self.wait(1)
        
        self.play(
            DrawBorderThenFill(example_outcome_rect),
            Write(example_outcome_label),
            Write(example_outcome_text)
        )
        self.wait(2)
        
        # Final fade out
        self.play(FadeOut(Group(*self.mobjects)))
        self.wait(1)